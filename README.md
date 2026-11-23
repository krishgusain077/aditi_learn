# Aditi Learning — Appearance Settings feature

React Native + Expo TypeScript starter for the Appearance Settings assignment.

## Run locally

Requires Node.js 20.19+ (Node 22 recommended) and an Expo-capable iOS/Android device or simulator.

```bash
npm install
npx expo install --check
npm start
```

Open in a compatible Expo Go/dev build or simulator. Use the **Appearance settings** button on the home screen.

## Existing architecture

- `src/theme/ThemeProvider.tsx`: **existing global provider**. Extend this provider with safe AsyncStorage hydration and persistence; do not create another provider.
- `src/theme/tokens.ts`: approved light/dark theme tokens. Use `colors` from `useAppTheme` and common `spacing`, `radii`, `typeScale` constants. No literal color hexes in screen styles.
- `src/screens/AppearanceSettings.tsx`: feature screen to implement. Reference PNGs are in `../DESIGN_REFERENCES/`.
- `src/screens/HomeScreen.tsx`: existing home screen to verify global live updates.
- `App.tsx`: simple existing navigation without adding new navigation dependencies.
- `tests/`: lightweight contract smoke checks (`npm run test:contracts`).

## Work to complete

Build the accessible theme Switch, connect to existing `useAppTheme` state, extend provider to asynchronously read/write AsyncStorage, handle storage failures without crashing, and verify restart persistence. Write and run unit tests for storage hydration/toggle behavior with a mocked storage layer. Do not use a second theme context or hardcode palette values.

## Validation expectations

1. `npm run typecheck` succeeds.
2. `npm run test:contracts` succeeds and add/run feature tests for toggle, hydration, storage rejection and restart persistence.
3. On a device/emulator, toggling updates Home and Appearance screens immediately, and the value survives a force-close/relaunch.
4. Record a short genuine screen capture showing the toggle and persistence, and document tests actually performed.

## Notes

AsyncStorage is asynchronous; use the existing provider's lifecycle and avoid race conditions and a visible wrong-theme flash. The `userInterfaceStyle` field in app.json is an app-level default, not the feature's persistent theme state.
