import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { SurfaceCard } from '../components/SurfaceCard';
import { spacing, typeScale } from '../theme/tokens';

/** Finish this feature using the supplied screen references and acceptance tests. */
export function AppearanceSettings({ onBack }: { onBack: () => void }) {
  const { colors } = useAppTheme();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Pressable accessibilityRole="button" onPress={onBack}>
          <Text style={[styles.back, { color: colors.primary }]}>‹ Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Appearance</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>Choose how the app looks on your device.</Text>
        <SurfaceCard>
          <Text style={[styles.label, { color: colors.text }]}>Theme preferences</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>Implement the accessible light/dark switch in this card.</Text>
        </SurfaceCard>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
  back: { fontSize: typeScale.body, fontWeight: '600' },
  title: { fontSize: typeScale.title, fontWeight: '700' },
  subtitle: { fontSize: typeScale.body, lineHeight: 24 },
  label: { fontSize: typeScale.subtitle, fontWeight: '700' },
});
