import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";
import Button from "../../../shared/components/ui/Button";
import { useFavoritesStore } from "../../../core/services/savedPropertiesStore";

interface SwipeEmptyStateProps {
  onReload: () => void;
  onChangeFilters: () => void;
  style?: any;
}

export default function SwipeEmptyState({
  onReload,
  onChangeFilters,
  style,
}: SwipeEmptyStateProps) {
  const { favorites } = useFavoritesStore();

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
        <Text style={styles.title}>No more apartments!</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          You've seen all available apartments in your area. Try adjusting your
          filters or check back later for new listings.
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Change Filters"
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
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Passed</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
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
