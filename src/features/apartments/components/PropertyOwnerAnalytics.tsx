import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

interface AnalyticsItem {
  id: string;
  title: string;
  value: string;
  change: string;
  color: string;
  icon: string;
}

interface PropertyOwnerAnalyticsProps {
  analytics: AnalyticsItem[];
  onAnalyticsPress: (analytic: AnalyticsItem) => void;
}

export default function PropertyOwnerAnalytics({
  analytics,
  onAnalyticsPress,
}: PropertyOwnerAnalyticsProps) {
  const renderAnalyticsCard = ({ item }: { item: AnalyticsItem }) => (
    <TouchableOpacity
      style={styles.analyticsCard}
      onPress={() => onAnalyticsPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.analyticsContent}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsIcon}>{item.icon}</Text>
          <Text style={styles.analyticsChange}>{item.change}</Text>
        </View>
        <Text style={styles.analyticsValue}>{item.value}</Text>
        <Text style={styles.analyticsTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Analytics</Text>
      <FlatList
        data={analytics}
        renderItem={renderAnalyticsCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.analyticsList}
      />
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
  analyticsList: {
    paddingHorizontal: spacing.sm,
  },
  analyticsCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    width: 160,
    ...shadows.sm,
  },
  analyticsContent: {
    alignItems: "flex-start",
  },
  analyticsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: spacing.sm,
  },
  analyticsIcon: {
    fontSize: 20,
  },
  analyticsChange: {
    ...textStyles.caption,
    color: colors.success[600],
    fontWeight: "600",
  },
  analyticsValue: {
    ...textStyles.h3,
    fontWeight: "700",
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  analyticsTitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
});
