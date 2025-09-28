import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

interface StatusSummary {
  totalProperties: number;
  availableProperties: number;
  bookedProperties: number;
  draftProperties: number;
  totalViews: number;
  totalInterests: number;
}

interface PropertyOwnerStatusSummaryProps {
  statusSummary: StatusSummary;
}

export default function PropertyOwnerStatusSummary({
  statusSummary,
}: PropertyOwnerStatusSummaryProps) {
  const [showStatusSummary, setShowStatusSummary] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.statusCard}
        onPress={() => setShowStatusSummary(!showStatusSummary)}
        activeOpacity={0.8}
      >
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: colors.primary[600] }]}>
              {statusSummary.totalProperties}
            </Text>
            <Text style={styles.statusLabel}>Properties</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: colors.success[600] }]}>
              {statusSummary.totalViews}
            </Text>
            <Text style={styles.statusLabel}>Views</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Text style={[styles.statusValue, { color: colors.warning[600] }]}>
              {statusSummary.totalInterests}
            </Text>
            <Text style={styles.statusLabel}>Interests</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Text style={styles.expandIcon}>
              {showStatusSummary ? "▲" : "▼"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded Status Summary */}
      {showStatusSummary && (
        <Animated.View style={styles.expandedStatusContent}>
          <View style={styles.expandedRow}>
            <View style={styles.summaryBullet} />
            <Text style={styles.summaryText}>
              Available Properties: {statusSummary.availableProperties}
            </Text>
          </View>
          <View style={styles.expandedRow}>
            <View style={styles.summaryBullet} />
            <Text style={styles.summaryText}>
              Booked Properties: {statusSummary.bookedProperties}
            </Text>
          </View>
          <View style={styles.expandedRow}>
            <View style={styles.summaryBullet} />
            <Text style={styles.summaryText}>
              Draft Properties: {statusSummary.draftProperties}
            </Text>
          </View>
          <View style={styles.expandedRow}>
            <View style={styles.summaryBullet} />
            <Text style={styles.summaryText}>
              Total Views: {statusSummary.totalViews}
            </Text>
          </View>
          <View style={styles.expandedRow}>
            <View style={styles.summaryBullet} />
            <Text style={styles.summaryText}>
              Total Interests: {statusSummary.totalInterests}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  statusCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusItem: {
    alignItems: "center",
    flex: 1,
  },
  statusValue: {
    ...textStyles.h3,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  statusLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.sm,
  },
  expandIcon: {
    ...textStyles.body,
    color: colors.neutral[500],
    fontWeight: "600",
  },
  expandedStatusContent: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  expandedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  summaryBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
    marginRight: spacing.sm,
  },
  summaryText: {
    ...textStyles.body,
    color: colors.neutral[700],
    flex: 1,
  },
});
