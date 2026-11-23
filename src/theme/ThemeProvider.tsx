import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { palette, type ThemeMode } from './tokens';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: (typeof palette)[ThemeMode];
  setMode: (next: ThemeMode) => void;
};
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Existing global provider. Extend this provider rather than creating a second theme context. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, updateMode] = useState<ThemeMode>('light');
  const setMode = useCallback((next: ThemeMode) => updateMode(next), []);
  const value = useMemo(() => ({ mode, colors: palette[mode], setMode }), [mode, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme must be called within ThemeProvider');
  return value;
}
// Feature work: add safe asynchronous storage hydration and persistence here.
// Keep the existing context API and tokens; avoid duplicate providers and flashes of the wrong theme.
