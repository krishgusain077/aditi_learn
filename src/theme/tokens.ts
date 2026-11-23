/** Brand tokens are the single source of color, spacing, and typography values. */
export const palette = {
  light: { background: '#F6F8FC', surface: '#FFFFFF', surfaceMuted: '#EAF0F8', text: '#17233C', mutedText: '#596980', primary: '#2457D6', border: '#DCE4EF', trackOff: '#A9B5C8', onPrimary: '#FFFFFF' },
  dark:  { background: '#10182B', surface: '#1C2940', surfaceMuted: '#26364F', text: '#F2F6FF', mutedText: '#B5C4D8', primary: '#8EADFF', border: '#36465F', trackOff: '#66758F', onPrimary: '#10182B' },
} as const;
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radii = { sm: 8, md: 14, lg: 22 } as const;
export const typeScale = { body: 16, caption: 13, subtitle: 18, title: 27 } as const;
export type ThemeMode = keyof typeof palette;
export type ThemeColors = (typeof palette)[ThemeMode];
