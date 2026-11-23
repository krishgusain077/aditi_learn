import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { SurfaceCard } from '../components/SurfaceCard';
import { SettingToggleRow } from '../components/SettingToggleRow';
import { spacing, typeScale } from '../theme/tokens';

export function AppearanceSettings({ onBack }: { onBack: () => void }) {
  const { colors, mode, setMode, isPersisted } = useAppTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to settings"
            onPress={onBack}
            hitSlop={spacing.sm}
          >
            <Text style={[styles.backText, { color: colors.primary }]}>‹ Settings</Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Appearance</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            Choose how the app looks on your device.
          </Text>
        </View>

        <View style={styles.cardList}>
          <SurfaceCard>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Theme preferences</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingToggleRow
              label="Dark mode"
              description="Reduce screen brightness"
              value={mode === 'dark'}
              onValueChange={(on) => setMode(on ? 'dark' : 'light')}
              accessibilityLabel="Dark mode"
            />
          </SurfaceCard>

          <SurfaceCard>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Changes apply instantly</Text>
            {isPersisted && (
              <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>
                Your choice is saved on this device.
              </Text>
            )}
          </SurfaceCard>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.brandText, { color: colors.primary }]}>ADITI LEARNING</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    gap: spacing.md,
  },
  backText: {
    fontSize: typeScale.body,
    fontWeight: '600',
  },
  title: {
    fontSize: typeScale.title,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typeScale.body,
    lineHeight: 24,
  },
  cardList: {
    flex: 1,
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  cardTitle: {
    fontSize: typeScale.subtitle,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: typeScale.caption,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  brandText: {
    fontSize: typeScale.caption,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
