import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../constants/tokens";
import Chip from "./Chip";

export type FlexibilityOption = "exact" | "3days" | "1week" | "2weeks";

interface FlexibilityChipGroupProps {
  label: string;
  value?: FlexibilityOption;
  onValueChange: (value: FlexibilityOption) => void;
  style?: any;
}

const flexibilityOptions = [
  {
    value: "exact" as FlexibilityOption,
    label: "Exact Date",
    icon: "📅",
  },
  {
    value: "3days" as FlexibilityOption,
    label: "±3 days",
    icon: "🔄",
  },
  {
    value: "1week" as FlexibilityOption,
    label: "±1 week",
    icon: "🔄",
  },
  {
    value: "2weeks" as FlexibilityOption,
    label: "±2 weeks",
    icon: "🔄",
  },
];

export default function FlexibilityChipGroup({
  label,
  value,
  onValueChange,
  style,
}: FlexibilityChipGroupProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.chipContainer}>
        {flexibilityOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={value === option.value}
            onPress={() => onValueChange(option.value)}
            variant="primary"
            style={styles.chip}
          />
        ))}
      </View>

      <Text style={styles.helperText}>
        Flexibility helps renters plan better
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    flex: 1,
    minWidth: 0,
  },
  helperText: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontStyle: "italic",
    textAlign: "center",
  },
});
