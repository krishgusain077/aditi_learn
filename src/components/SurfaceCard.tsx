import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { radii, spacing } from '../theme/tokens';

export function SurfaceCard({ children, style, ...props }: ViewProps) {
  const { colors } = useAppTheme();
  return <View {...props} style={[styles.root, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}
const styles = StyleSheet.create({ root: { borderWidth: 1, borderRadius: radii.lg, padding: spacing.lg } });
