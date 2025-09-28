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

interface Stat {
  title: string;
  value: string;
  change: string;
  color: string;
  icon: string;
}

interface PropertyOwnerStatsProps {
  stats: Stat[];
}

export default function PropertyOwnerStats({ stats }: PropertyOwnerStatsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Performance Overview</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.statCard}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[stat.color + "15", stat.color + "05"]}
              style={styles.statGradient}
            >
              <View style={styles.statContent}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={styles.statChange}>{stat.change}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.sm,
  },
  statGradient: {
    padding: spacing.md,
  },
  statContent: {
    alignItems: "flex-start",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: spacing.sm,
  },
  statIcon: {
    fontSize: 20,
  },
  statChange: {
    ...textStyles.caption,
    color: colors.success[600],
    fontWeight: "600",
  },
  statValue: {
    ...textStyles.h2,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  statTitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
});
