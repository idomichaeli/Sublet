import React from "react";
import { View, StyleSheet } from "react-native";
import GenericSection from "../../../shared/components/ui/GenericSection";
import GenericActionButton from "../../../shared/components/ui/GenericActionButton";
import { colors, spacing } from "../../../shared/constants/tokens";

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  badge?: string;
  onPress: () => void;
}

interface PropertyOwnerQuickActionsGenericProps {
  quickActions: QuickAction[];
}

export default function PropertyOwnerQuickActionsGeneric({
  quickActions,
}: PropertyOwnerQuickActionsGenericProps) {
  return (
    <GenericSection title="Quick Actions" variant="default">
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <View key={action.id} style={styles.quickActionItem}>
            <GenericActionButton
              label={action.title}
              icon={action.icon}
              onPress={action.onPress}
              variant="ghost"
              size="lg"
              fullWidth={true}
              style={
                [
                  styles.quickActionButton,
                  { backgroundColor: action.color + "20" },
                ] as any
              }
              textStyle={styles.quickActionText}
            />
            {action.badge && (
              <View style={styles.badge}>
                <GenericActionButton
                  label={action.badge}
                  onPress={() => {}}
                  variant="primary"
                  size="sm"
                  style={styles.badgeButton}
                  textStyle={styles.badgeText}
                />
              </View>
            )}
          </View>
        ))}
      </View>
    </GenericSection>
  );
}

const styles = StyleSheet.create({
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  quickActionItem: {
    width: "48%",
    position: "relative",
  },
  quickActionButton: {
    paddingVertical: spacing.lg,
    borderRadius: 12,
    borderWidth: 0,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral[800],
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  badgeButton: {
    minWidth: 24,
    minHeight: 24,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
