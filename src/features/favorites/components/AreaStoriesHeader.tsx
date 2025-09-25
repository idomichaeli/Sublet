import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";

interface AreaStoriesHeaderProps {
  areaCount: number;
}

export default function AreaStoriesHeader({
  areaCount,
}: AreaStoriesHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Your Areas</Text>
      <Text style={styles.headerSubtitle}>
        {areaCount} area{areaCount !== 1 ? "s" : ""} with favorites
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: 2,
  },
  headerSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
});
