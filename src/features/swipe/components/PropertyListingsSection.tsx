import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

// Core imports
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";
import { GenericCard } from "../../../shared/components/ui";

// Service imports
import { useFilterStore } from "../../../core/services/propertyFilterStore";

// Types
export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  status: "available" | "unavailable" | "pending";
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  size: number;
}

interface PropertyListingsSectionProps {
  listings: Listing[];
  onListingPress: (listingId: string) => void;
  onBookPress: (listingId: string) => void;
  onFavoritePress: (listingId: string) => void;
}

/**
 * Property listings section component that displays properties in a list format
 * with comprehensive empty state handling
 */
export default function PropertyListingsSection({
  listings,
  onListingPress,
  onBookPress,
  onFavoritePress,
}: PropertyListingsSectionProps) {
  // Store hooks
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
      : "no_properties_available";
  }, [hasNoMatchingProperties, hasActiveFilters]);

  /**
   * Memoized empty state content
   */
  const emptyStateContent = useMemo(() => {
    switch (emptyStateType) {
      case "no_matching_properties":
        return {
          title: "No matching properties found",
          subtitle: "Try adjusting your filters to see more results.",
        };
      case "no_properties_available":
      default:
        return {
          title: "No properties available",
          subtitle: "Check back later for new listings.",
        };
    }
  }, [emptyStateType]);

  /**
   * Renders individual listing item
   */
  const renderListing = React.useCallback(
    ({ item }: { item: Listing }) => (
      <GenericCard
        id={item.id}
        title={item.title}
        subtitle={item.location}
        imageUrl={item.imageUrl}
        price={item.price}
        priceUnit="/night"
        rating={item.rating}
        reviewCount={item.reviewCount}
        status={item.status}
        stats={[
          { label: "Bedrooms", value: item.bedrooms, icon: "🛏️" },
          { label: "Bathrooms", value: item.bathrooms, icon: "🚿" },
          { label: "Size", value: `${item.size}m²`, icon: "📐" },
        ]}
        onPress={() => onListingPress(item.id)}
        onActionPress={() => onBookPress(item.id)}
        actionLabel="View Details"
        showStatus={true}
        showPrice={true}
        showRating={true}
        showStats={true}
        showActions={true}
        showFavorite={true}
        isFavorite={item.isFavorite}
        onFavoritePress={() => onFavoritePress(item.id)}
        variant="detailed"
      />
    ),
    [onListingPress, onBookPress, onFavoritePress]
  );

  /**
   * Renders empty state when no listings are available
   */
  const renderEmptyState = React.useCallback(
    () => (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateIcon}>🔍</Text>
        <Text style={styles.emptyStateTitle}>{emptyStateContent.title}</Text>
        <Text style={styles.emptyStateSubtitle}>
          {emptyStateContent.subtitle}
        </Text>
      </View>
    ),
    [emptyStateContent]
  );

  /**
   * Renders list header with count
   */
  const renderListHeader = React.useCallback(
    () => (
      <View style={styles.listingsHeader}>
        <Text style={styles.listingsTitle}>Available Apartments</Text>
        <Text style={styles.listingsCount}>{listings.length} properties</Text>
      </View>
    ),
    [listings.length]
  );

  return (
    <View style={styles.listingsContainer}>
      {renderListHeader()}

      {listings.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListing}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listingsList}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listingsContainer: {
    flex: 1,
    padding: spacing.md,
    paddingBottom: 100, // Extra padding to place cards above nav bar
  },
  listingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  listingsTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
  },
  listingsCount: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  listingsList: {
    paddingBottom: 200, // Extra padding to place cards above floating nav bar
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    ...textStyles.h3,
    color: colors.neutral[700],
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
    lineHeight: 24,
  },
});
