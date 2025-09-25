import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  style?: any;
}

export default function ProgressIndicator({
  current,
  total,
  style,
}: ProgressIndicatorProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  const remaining = Math.max(0, total - current);

  return (
    <View style={[styles.container, style]}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Progress Text */}
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>{remaining} apartments left</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  progressBarContainer: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.neutral[200],
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  progressTextContainer: {
    alignItems: "center",
  },
  progressText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 12,
  },
});
