import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { palette, type ThemeMode } from './tokens';
import { DEFAULT_THEME_MODE, readStoredMode, writeStoredMode } from './themeStorage';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: (typeof palette)[ThemeMode];
  setMode: (next: ThemeMode) => void;
  /** true when the last AsyncStorage read/write succeeded */
  isPersisted: boolean;
};
const ThemeContext = createContext(undefined as ThemeContextValue | undefined);

/** Existing global provider, extended with safe AsyncStorage hydration + persistence. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, updateMode] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [hydrated, setHydrated] = useState(false);
  const [isPersisted, setIsPersisted] = useState(false);
  const writeSeq = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await readStoredMode(); // never throws
      if (cancelled) return;
      updateMode(result.mode);
      setIsPersisted(result.ok);
      setHydrated(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    updateMode(next); // immediate UI update
    const seq = ++writeSeq.current;
    void writeStoredMode(next).then((ok) => {
      if (seq === writeSeq.current) setIsPersisted(ok); // latest write wins
    });
  }, []);

  const value = useMemo(
    () => ({ mode, colors: palette[mode], setMode, isPersisted }),
    [mode, setMode, isPersisted],
  );

  // Render nothing until the stored mode is known → no flash of the wrong theme.
  if (!hydrated) return null;
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme must be called within ThemeProvider');
  return value;
}
