import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { spacing, typeScale } from '../theme/tokens';

export interface SettingToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  accessibilityLabel?: string;
}

export function SettingToggleRow({
  label,
  description,
  value,
  onValueChange,
  accessibilityLabel = label,
}: SettingToggleRowProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.description, { color: colors.mutedText }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ checked: value }}
        trackColor={{ false: colors.trackOff, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontSize: typeScale.body,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typeScale.caption,
    lineHeight: 18,
  },
});
