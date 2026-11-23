import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { SurfaceCard } from '../components/SurfaceCard';
import { spacing, typeScale, radii } from '../theme/tokens';

export function HomeScreen({ onOpenAppearance }: { onOpenAppearance: () => void }) {
  const { colors, mode } = useAppTheme();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>ADITI LEARNING</Text>
        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.copy, { color: colors.mutedText }]}>Make your learning space your own.</Text>
        <SurfaceCard>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Your preferences</Text>
          <Text style={[styles.copy, { color: colors.mutedText }]}>Current appearance: {mode}</Text>
          <Pressable accessibilityRole="button" onPress={onOpenAppearance} style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={[styles.buttonLabel, { color: colors.onPrimary }]}>Appearance settings</Text>
          </Pressable>
        </SurfaceCard>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { padding: spacing.lg, gap: spacing.md, paddingTop: spacing.xl },
  eyebrow: { fontSize: typeScale.caption, fontWeight: '700', letterSpacing: 2 },
  title: { fontSize: typeScale.title, fontWeight: '700' }, copy: { fontSize: typeScale.body, lineHeight: 24 },
  cardTitle: { fontSize: typeScale.subtitle, fontWeight: '700', marginBottom: spacing.sm },
  button: { marginTop: spacing.lg, borderRadius: radii.md, padding: spacing.md, alignItems: 'center' },
  buttonLabel: { fontSize: typeScale.body, fontWeight: '700' },
});
