import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from './tokens';

export const THEME_STORAGE_KEY = 'aditi:appearance:mode:v1';
export const DEFAULT_THEME_MODE: ThemeMode = 'light';

/** Anything that is not exactly 'light' or 'dark' falls back to light. */
export function parseThemeMode(raw: unknown): ThemeMode {
  return raw === 'light' || raw === 'dark' ? raw : DEFAULT_THEME_MODE;
}

export async function readStoredMode(): Promise<{ mode: ThemeMode; ok: boolean }> {
  try {
    const raw = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return { mode: parseThemeMode(raw), ok: true };
  } catch {
    return { mode: DEFAULT_THEME_MODE, ok: false };
  }
}

export async function writeStoredMode(mode: ThemeMode): Promise<boolean> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    return true;
  } catch {
    return false;
  }
}
