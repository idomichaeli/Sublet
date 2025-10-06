import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

// Core imports
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

// Component imports
import Button from "../../../shared/components/ui/Button";

// Service imports
import { useFavoritesStore } from "../../../core/services/savedPropertiesStore";
import { useFilterStore } from "../../../core/services/propertyFilterStore";

// Types
interface SwipeEmptyStateProps {
  onReload: () => void;
  onChangeFilters: () => void;
  style?: any;
}

/**
 * Empty state component for swipe discovery screen
 * Shows different messages based on whether filters are active or not
 */
export default function SwipeEmptyState({
  onReload,
  onChangeFilters,
  style,
}: SwipeEmptyStateProps) {
  // Store hooks
  const { favorites } = useFavoritesStore();
  const { hasNoMatchingProperties, appliedFilters } = useFilterStore();

  /**
   * Memoized active filters count
   */
  const activeFiltersCount = useMemo(() => {
    return Object.keys(appliedFilters).length;
  }, [appliedFilters]);

  /**
   * Memoized has active filters flag
   */
  const hasActiveFilters = useMemo(() => {
    return activeFiltersCount > 0;
  }, [activeFiltersCount]);

  /**
   * Memoized empty state type
   */
  const emptyStateType = useMemo(() => {
    return hasNoMatchingProperties && hasActiveFilters
      ? "no_matching_properties"
      : "no_more_properties";
  }, [hasNoMatchingProperties, hasActiveFilters]);

  /**
   * Memoized empty state content
   */
  const emptyStateContent = useMemo(() => {
    switch (emptyStateType) {
      case "no_matching_properties":
        return {
          title: "No matching properties!",
          subtitle:
            "No properties match your current filters. Try adjusting your search criteria to see more results.",
          buttonText: "Adjust Filters",
        };
      case "no_more_properties":
      default:
        return {
          title: "No more apartments!",
          subtitle:
            "You've seen all available apartments in your area. Try adjusting your filters or check back later for new listings.",
          buttonText: "Change Filters",
        };
    }
  }, [emptyStateType]);

  /**
   * Memoized stats data
   */
  const statsData = useMemo(() => {
    const likedCount = favorites.length;
    const passedCount = 0; // TODO: Track passed count
    const totalCount = likedCount + passedCount;

    return {
      liked: likedCount,
      passed: passedCount,
      total: totalCount,
    };
  }, [favorites.length]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require("../../../app/assets/icon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{emptyStateContent.title}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{emptyStateContent.subtitle}</Text>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title={emptyStateContent.buttonText}
            variant="secondary"
            size="lg"
            style={styles.actionButton}
            onPress={onChangeFilters}
          />

          <Button
            title="Reload"
            variant="primary"
            size="lg"
            style={styles.actionButton}
            onPress={onReload}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statsData.liked}</Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statsData.passed}</Text>
            <Text style={styles.statLabel}>Passed</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{statsData.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.neutral[50],
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 60,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  icon: {
    width: 300,
    height: 300,
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
    marginBottom: spacing["2xl"],
  },
  actionsContainer: {
    width: "100%",
    gap: spacing.md,
    marginBottom: spacing["2xl"],
  },
  actionButton: {
    width: "100%",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.md,
  },
});
