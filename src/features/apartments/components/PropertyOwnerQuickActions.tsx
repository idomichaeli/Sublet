import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  badge?: string;
  onPress: () => void;
}

interface PropertyOwnerQuickActionsProps {
  quickActions: QuickAction[];
}

export default function PropertyOwnerQuickActions({
  quickActions,
}: PropertyOwnerQuickActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionCard}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[action.color + "20", action.color + "10"]}
              style={styles.quickActionGradient}
            >
              <View style={styles.quickActionContent}>
                <View style={styles.quickActionIconContainer}>
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                {action.badge && (
                  <View style={styles.quickActionBadge}>
                    <Text style={styles.quickActionBadgeText}>
                      {action.badge}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.sm,
  },
  quickActionGradient: {
    padding: spacing.md,
  },
  quickActionContent: {
    alignItems: "center",
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral[0],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionTitle: {
    ...textStyles.body,
    fontWeight: "600",
    color: colors.neutral[800],
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  quickActionBadge: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  quickActionBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
  },
});
