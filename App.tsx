import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeProvider';
import { HomeScreen } from './src/screens/HomeScreen';
import { AppearanceSettings } from './src/screens/AppearanceSettings';

function AppContent() {
  const [route, setRoute] = useState<'home' | 'appearance'>('home');
  const { mode } = useAppTheme();
  return <>
    <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
    {route === 'home'
      ? <HomeScreen onOpenAppearance={() => setRoute('appearance')} />
      : <AppearanceSettings onBack={() => setRoute('home')} />}
  </>;
}
export default function App() { return <ThemeProvider><AppContent /></ThemeProvider>; }
