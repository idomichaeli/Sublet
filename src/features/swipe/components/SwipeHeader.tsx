import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../../shared/constants/tokens";

interface TinderHeaderProps {
  remainingCards: number;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
}

export default function TinderHeader({
  remainingCards,
  onFilterPress,
  hasActiveFilters = false,
}: TinderHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>Discover</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.remainingText}>{remainingCards} left</Text>

        {onFilterPress && (
          <TouchableOpacity
            style={[
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive,
            ]}
            onPress={onFilterPress}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  leftSection: {
    flex: 1,
  },
  title: {
    ...textStyles.h2,
    color: colors.primary[600],
    fontWeight: "700",
    fontSize: 24,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  remainingText: {
    ...textStyles.body,
    color: colors.neutral[500],
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 40,
    height: 40,
  },
  filterButtonActive: {
    backgroundColor: colors.primary[100],
  },
  filterIcon: {
    fontSize: 16,
  },
  filterIndicator: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error[500],
  },
});
