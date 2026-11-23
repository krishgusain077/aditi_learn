import React from 'react';
import { render, fireEvent, waitFor, act, renderHook } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fs from 'node:fs';
import path from 'node:path';

import { ThemeProvider, useAppTheme } from '../src/theme/ThemeProvider';
import { AppearanceSettings } from '../src/screens/AppearanceSettings';
import { THEME_STORAGE_KEY } from '../src/theme/themeStorage';
import { palette } from '../src/theme/tokens';
import App from '../App';

// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Appearance and Theme Persistence Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1. Fresh install (empty storage) resolves to 'light'
  test('1. empty storage resolves to mode === "light"', async () => {
    const { result } = await renderHook(() => useAppTheme(), {
      wrapper: ThemeProvider,
    });
    await waitFor(() => {
      expect(result.current?.mode).toBe('light');
      expect(result.current?.isPersisted).toBe(true);
    });
  });

  // 2. Stored 'dark' -> hydrated as dark (and children never rendered with wrong mode first)
  test('2. stored dark is hydrated on startup before children render with wrong mode', async () => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const modesSeen: string[] = [];

    function Consumer() {
      const { mode } = useAppTheme();
      modesSeen.push(mode);
      return null;
    }

    await render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(modesSeen.length).toBeGreaterThan(0);
      expect(modesSeen.every((m) => m === 'dark')).toBe(true);
    });
  });

  // 3. Stored 'light' -> light
  test('3. stored light is hydrated correctly', async () => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, 'light');
    const { result } = await renderHook(() => useAppTheme(), {
      wrapper: ThemeProvider,
    });
    await waitFor(() => {
      expect(result.current?.mode).toBe('light');
    });
  });

  // 4. Stored garbage ('banana', '', 'DARK') -> light
  test.each(['banana', '', 'DARK'])(
    '4. stored invalid value %p falls back safely to light',
    async (garbage) => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, garbage);
      const { result } = await renderHook(() => useAppTheme(), {
        wrapper: ThemeProvider,
      });
      await waitFor(() => {
        expect(result.current?.mode).toBe('light');
      });
    }
  );

  // 5. Toggling updates useAppTheme().mode and colors immediately
  test('5. toggling updates mode and colors immediately', async () => {
    const { result } = await renderHook(() => useAppTheme(), {
      wrapper: ThemeProvider,
    });
    await waitFor(() => expect(result.current?.mode).toBe('light'));

    await act(async () => {
      result.current?.setMode('dark');
    });

    await waitFor(() => {
      expect(result.current?.mode).toBe('dark');
      expect(result.current?.colors.background).toBe(palette.dark.background);
      expect(result.current?.colors.text).toBe(palette.dark.text);
    });
  });

  // 6. Toggle calls AsyncStorage.setItem('aditi:appearance:mode:v1', 'dark')
  test('6. toggle writes mode to AsyncStorage key aditi:appearance:mode:v1', async () => {
    const { result } = await renderHook(() => useAppTheme(), {
      wrapper: ThemeProvider,
    });
    await waitFor(() => expect(result.current?.mode).toBe('light'));

    await act(async () => {
      result.current?.setMode('dark');
    });

    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      expect(stored).toBe('dark');
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
  });

  // 7. getItem rejects -> no crash, light fallback; setItem rejects -> no crash, mode still changes, helper text hidden
  test('7. AsyncStorage failures do not crash app; setItem failure hides helper text', async () => {
    // 7a: getItem failure
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Read error'));
    const { result } = await renderHook(() => useAppTheme(), {
      wrapper: ThemeProvider,
    });
    await waitFor(() => {
      expect(result.current?.mode).toBe('light');
      expect(result.current?.isPersisted).toBe(false);
    });

    // 7b: setItem failure
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Write error'));
    const screen = await render(
      <ThemeProvider>
        <AppearanceSettings onBack={jest.fn()} />
      </ThemeProvider>
    );
    await waitFor(() => expect(screen.getByLabelText('Dark mode')).toBeTruthy());

    const toggle = screen.getByLabelText('Dark mode');
    fireEvent(toggle, 'valueChange', true);

    await waitFor(() => {
      expect(screen.queryByText('Your choice is saved on this device.')).toBeNull();
    });
  });

  // 8. Restart simulation: toggle to dark -> unmount -> render fresh provider -> still dark
  test('8. restart simulation restores last persisted value', async () => {
    const firstRender = await render(
      <ThemeProvider>
        <AppearanceSettings onBack={jest.fn()} />
      </ThemeProvider>
    );
    await waitFor(() => expect(firstRender.getByLabelText('Dark mode')).toBeTruthy());

    fireEvent(firstRender.getByLabelText('Dark mode'), 'valueChange', true);
    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      expect(stored).toBe('dark');
    });

    await firstRender.unmount();

    // Remount a fresh provider instance
    const secondRender = await render(
      <ThemeProvider>
        <AppearanceSettings onBack={jest.fn()} />
      </ThemeProvider>
    );
    await waitFor(() => {
      const switchEl = secondRender.getByLabelText('Dark mode');
      expect(switchEl.props.value).toBe(true);
      expect(secondRender.getByText('Your choice is saved on this device.')).toBeTruthy();
    });
  });

  // 9. Switch found via getByLabelText('Dark mode') / role switch; checked state flips with mode
  test('9. switch has accessible label and role switch, checked state flips', async () => {
    const screen = await render(
      <ThemeProvider>
        <AppearanceSettings onBack={jest.fn()} />
      </ThemeProvider>
    );
    await waitFor(() => expect(screen.getByLabelText('Dark mode')).toBeTruthy());

    const toggle = screen.getByLabelText('Dark mode');
    expect(toggle.props.accessibilityRole).toBe('switch');
    expect(toggle.props.accessibilityState.checked).toBe(false);
    expect(toggle.props.value).toBe(false);

    fireEvent(toggle, 'valueChange', true);

    await waitFor(() => {
      expect(toggle.props.accessibilityState.checked).toBe(true);
      expect(toggle.props.value).toBe(true);
    });
  });

  // 10. Static scan: ThemeProvider.tsx, AppearanceSettings.tsx (and any new component) have no hex colors and createContext count is 1
  test('10. static scan: zero hardcoded hex colors and exactly one createContext in src', () => {
    const srcDir = path.join(__dirname, '../src');
    const hexRegex = /#[0-9a-fA-F]{3,8}\b/;

    function scanFiles(dir: string, fileList: string[] = []): string[] {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          scanFiles(fullPath, fileList);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
          fileList.push(fullPath);
        }
      }
      return fileList;
    }

    const allSourceFiles = scanFiles(srcDir);
    let createContextCount = 0;

    for (const file of allSourceFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const relPath = path.relative(srcDir, file).replace(/\\/g, '/');

      // tokens.ts is allowed to have the palette definition
      if (relPath !== 'theme/tokens.ts') {
        const hexMatch = content.match(hexRegex);
        expect(hexMatch).toBeNull();
      }

      const matches = content.match(/createContext\s*[(<]/g);
      if (matches) {
        createContextCount += matches.length;
      }
    }

    expect(createContextCount).toBe(1);
  });

  // Integration test: render App.tsx -> press "Appearance settings" -> toggle switch -> go back -> Home shows dark
  test('integration: flow from Home to Appearance, toggle, return to Home with updated theme', async () => {
    const screen = await render(<App />);
    await waitFor(() => expect(screen.getByText('Current appearance: light')).toBeTruthy());

    // Press Appearance settings button
    const openBtn = screen.getByText('Appearance settings');
    fireEvent.press(openBtn);

    // Should now be on Appearance screen
    await waitFor(() => expect(screen.getByText('Appearance')).toBeTruthy());
    const toggle = screen.getByLabelText('Dark mode');
    fireEvent(toggle, 'valueChange', true);

    // Go back using ‹ Settings
    const backBtn = screen.getByLabelText('Back to settings');
    fireEvent.press(backBtn);

    // Home screen now shows dark
    await waitFor(() => {
      expect(screen.getByText('Current appearance: dark')).toBeTruthy();
    });
  });
});
