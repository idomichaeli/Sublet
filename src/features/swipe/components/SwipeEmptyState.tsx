import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

interface SwipeEmptyStateProps {
  onReload: () => void;
  onChangeFilters: () => void;
}

export default function SwipeEmptyState({
  onReload,
  onChangeFilters,
}: SwipeEmptyStateProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onReload}
          >
            <Text style={styles.primaryButtonText}>Reload Apartments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onChangeFilters}
          >
            <Text style={styles.secondaryButtonText}>Change Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  actions: {
    width: "100%",
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.md,
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
  },
  secondaryButton: {
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  primaryButtonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  secondaryButtonText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "600",
  },
});
