import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { colors, spacing } from "../../../shared/constants/tokens";
import Button from "../../../shared/components/ui/Button";

export interface FilterOption {
  label: string;
  value: string;
}

interface QuickFiltersProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterValue: string) => void;
}

export default function QuickFilters({
  filters,
  activeFilter,
  onFilterChange,
}: QuickFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
      contentContainerStyle={styles.filtersContent}
    >
      {filters.map((filter) => (
        <Button
          key={filter.value}
          title={filter.label}
          variant={activeFilter === filter.value ? "primary" : "secondary"}
          size="sm"
          style={styles.filterButton}
          onPress={() => onFilterChange(filter.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  filterButton: {
    marginRight: spacing.sm,
  },
});
