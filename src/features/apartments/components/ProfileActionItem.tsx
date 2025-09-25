import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, borderRadius, textStyles } from "../../../shared/constants/tokens";

export interface ProfileActionItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  style?: any;
}

export default function ProfileActionItem({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  style,
}: ProfileActionItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {showArrow && (
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  arrowContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: 18,
    color: colors.neutral[400],
    fontWeight: "300",
  },
});
