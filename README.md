# Aditi Learning — Appearance Settings feature

React Native + Expo TypeScript application for the Appearance Settings assignment.

## Run locally

Requires Node.js 20.19+ (Node 22 recommended) and an Expo-capable iOS/Android device or simulator.

```bash
npm install
npx expo install --check
npm start
```

Open in a compatible Expo Go/dev build or simulator. Use the **Appearance settings** button on the home screen.

## How to test

```bash
npm run typecheck          # TypeScript check (tsc --noEmit)
npm run test:contracts     # Contract smoke test (node --test)
npm test                   # Jest feature acceptance test suite
```

## Existing architecture

- `src/theme/ThemeProvider.tsx`: **existing global provider**. Extended with safe AsyncStorage hydration and persistence without creating any duplicate context.
- `src/theme/tokens.ts`: approved light/dark theme tokens. Single source of truth for color, spacing, radius, and typography constants.
- `src/theme/themeStorage.ts`: dedicated storage isolation module for reading and writing persisted theme preference.
- `src/components/SurfaceCard.tsx`: reusable rounded container styled dynamically with current theme tokens.
- `src/components/SettingToggleRow.tsx`: accessible toggle row component encapsulating label, description, and native switch.
- `src/screens/AppearanceSettings.tsx`: feature settings screen with header, cards, live switch, and footer.
- `src/screens/HomeScreen.tsx`: home screen reflecting global live theme mode updates.
- `App.tsx`: simple state-based screen switcher without adding external navigation dependencies.
- `tests/`: contract checks (`tokens.test.cjs`) and comprehensive feature test suite (`appearance.test.tsx`).

## Appearance persistence & failure behavior

- **Storage key:** `aditi:appearance:mode:v1`
- **Supported values:** `'light'` | `'dark'` (default: `'light'`)
- **Hydration:** Happens once on application startup via `readStoredMode()`.
- **No wrong-theme flash:** Until hydration finishes, `ThemeProvider` renders `null` instead of children, preventing any flash of an incorrect theme.
- **Invalid values:** Stored garbage or unexpected values (e.g., `'banana'`, `''`, `'DARK'`) safely fall back to `'light'`.
- **Read failure behavior:** If AsyncStorage `getItem` fails or rejects, `readStoredMode()` catches the error, falls back to `'light'`, sets `isPersisted = false`, and the app operates smoothly in-memory without crashing.
- **Write failure behavior:** If AsyncStorage `setItem` fails or rejects, `writeStoredMode()` catches the error and returns `false`. `isPersisted` is updated to `false`, and the helper text `"Your choice is saved on this device."` is hidden. The theme continues to function in-memory for the active session.
- **Race condition safety:** Rapid toggling is protected by a sequence counter (`writeSeq`). Only the latest asynchronous write updates `isPersisted`, ensuring stale promises never overwrite the latest state.
