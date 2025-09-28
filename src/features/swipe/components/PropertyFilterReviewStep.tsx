import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../../shared/constants/tokens";
import Chip from "../../../shared/components/ui/Chip";
import { FilterData, FilterStepProps } from "../types/PropertyFilterData";

export default function PropertyFilterReviewStep({
  data,
  onUpdate,
}: FilterStepProps) {
  const getSelectedCount = () => {
    let count = 0;
    if (data.propertyType) count++;
    if (data.bedrooms) count++;
    if (data.bathrooms) count++;
    if (data.minSize || data.maxSize) count++;
    if (data.amenities && data.amenities.length > 0) count++;
    if (data.minPrice || data.maxPrice) count++;
    if (data.areas && data.areas.length > 0) count++;
    return count;
  };

  const renderFilterSummary = () => {
    const filters = [];

    if (data.propertyType) {
      filters.push(
        <View key="propertyType" style={styles.filterItem}>
          <Text style={styles.filterLabel}>Property Type:</Text>
          <Chip
            label={data.propertyType}
            selected={true}
            variant="primary"
            style={styles.filterChip}
          />
        </View>
      );
    }

    if (data.bedrooms) {
      filters.push(
        <View key="bedrooms" style={styles.filterItem}>
          <Text style={styles.filterLabel}>Bedrooms:</Text>
          <Chip
            label={data.bedrooms === 4 ? "4+" : data.bedrooms.toString()}
            selected={true}
            variant="primary"
            style={styles.filterChip}
          />
        </View>
      );
    }

    if (data.bathrooms) {
      filters.push(
        <View key="bathrooms" style={styles.filterItem}>
          <Text style={styles.filterLabel}>Bathrooms:</Text>
          <Chip
            label={data.bathrooms === 3 ? "3+" : data.bathrooms.toString()}
            selected={true}
            variant="primary"
            style={styles.filterChip}
          />
        </View>
      );
    }

    if (data.minSize || data.maxSize) {
      const sizeRange = `${data.minSize || 0} - ${data.maxSize || "∞"} m²`;
      filters.push(
        <View key="size" style={styles.filterItem}>
          <Text style={styles.filterLabel}>Size Range:</Text>
          <Chip
            label={sizeRange}
            selected={true}
            variant="primary"
            style={styles.filterChip}
          />
        </View>
      );
    }

    if (data.amenities && data.amenities.length > 0) {
      filters.push(
        <View key="amenities" style={styles.filterItem}>
          <Text style={styles.filterLabel}>Amenities:</Text>
          <View style={styles.amenitiesContainer}>
            {data.amenities.slice(0, 3).map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                selected={true}
                variant="primary"
                style={styles.filterChip}
              />
            ))}
            {data.amenities.length > 3 && (
              <Chip
                label={`+${data.amenities.length - 3} more`}
                selected={true}
                variant="secondary"
                style={styles.filterChip}
              />
            )}
          </View>
        </View>
      );
    }

    if (data.minPrice || data.maxPrice) {
      const priceRange = `$${data.minPrice || 0} - $${data.maxPrice || "∞"}`;
      filters.push(
        <View key="price" style={styles.filterItem}>
          <Text style={styles.filterLabel}>Price Range:</Text>
          <Chip
            label={priceRange}
            selected={true}
            variant="primary"
            style={styles.filterChip}
          />
        </View>
      );
    }

    if (data.areas && data.areas.length > 0) {
      filters.push(
        <View key="areas" style={styles.filterItem}>
          <Text style={styles.filterLabel}>Areas:</Text>
          <View style={styles.amenitiesContainer}>
            {data.areas.map((area) => (
              <Chip
                key={area}
                label={area}
                selected={true}
                variant="primary"
                style={styles.filterChip}
              />
            ))}
          </View>
        </View>
      );
    }

    return filters;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Review Your Filters</Text>
          <Text style={styles.subtitle}>
            {getSelectedCount()} filter{getSelectedCount() !== 1 ? "s" : ""}{" "}
            selected
          </Text>
        </View>

        <View style={styles.filtersContainer}>{renderFilterSummary()}</View>

        {getSelectedCount() === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No filters selected. All properties will be shown.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  filtersContainer: {
    gap: spacing.md,
  },
  filterItem: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  filterLabel: {
    ...textStyles.body,
    fontWeight: "600",
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },
  filterChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emptyState: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: "center",
  },
  emptyStateText: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
  },
});
