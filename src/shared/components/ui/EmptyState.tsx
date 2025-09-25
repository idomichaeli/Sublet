import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, textStyles, borderRadius } from "../../../shared/constants/tokens";
import Button from "./Button";

export interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: any;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onActionPress,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {actionLabel && onActionPress && (
        <Button
          title={actionLabel}
          onPress={onActionPress}
          variant="primary"
          style={styles.actionButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    ...textStyles.h3,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[500],
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  actionButton: {
    paddingHorizontal: spacing.xl,
  },
});
