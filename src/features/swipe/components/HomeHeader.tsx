import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../../shared/constants/tokens";

type ViewMode = "list" | "swipe";

interface HomeHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function HomeHeader({
  viewMode,
  onViewModeChange,
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.subtitle}>Find your perfect place to stay</Text>
        </View>
        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "swipe" && styles.toggleButtonActive,
            ]}
            onPress={() => onViewModeChange("swipe")}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === "swipe" && styles.toggleTextActive,
              ]}
            >
              Swipe
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "list" && styles.toggleButtonActive,
            ]}
            onPress={() => onViewModeChange("list")}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === "list" && styles.toggleTextActive,
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  viewModeToggle: {
    flexDirection: "row",
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary[500],
  },
  toggleText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "500",
  },
  toggleTextActive: {
    color: colors.neutral[0],
  },
});
