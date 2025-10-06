import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Core imports
import { colors, spacing } from "../../../shared/constants/tokens";
import { SwipeCardData } from "../components/SwipeCard";
import { FilterData } from "../types/FilterData";

// Service imports
import { renterPropertyService } from "../../../core/services/renterPropertyService";
import { propertyFilterService } from "../../../core/services/propertyFilterService";
import { useFavoritesStore } from "../../../core/services/savedPropertiesStore";
import { useFilterStore } from "../../../core/services/propertyFilterStore";

// Component imports
import SearchBar from "../../../shared/components/ui/SearchBar";
import SwipeDiscoveryScreen from "../SwipeDiscoveryScreen";
import HomeHeader from "../components/HomeHeader";
import PropertyListingsSection from "../components/PropertyListingsSection";
import FilterBottomSheet from "../components/FilterBottomSheet";

// Types
type ViewMode = "list" | "swipe";

interface PropertyDiscoveryHomeScreenProps {
  navigation: any;
}

interface PropertyListing {
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

/**
 * Main property discovery screen that handles both list and swipe views
 * with comprehensive filtering capabilities
 */
export default function PropertyDiscoveryHomeScreen({
  navigation,
}: PropertyDiscoveryHomeScreenProps) {
  // Local state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("swipe");
  const [showFilterSheet, setShowFilterSheet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Store hooks
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const {
    appliedFilters,
    setAppliedFilters,
    filteredProperties,
    setFilteredProperties,
    hasNoMatchingProperties,
    setHasNoMatchingProperties,
  } = useFilterStore();

  // Load initial properties
  useEffect(() => {
    loadInitialProperties();
  }, []);

  /**
   * Loads all published properties on component mount
   */
  const loadInitialProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const properties =
        await renterPropertyService.getAllPublishedProperties();

      // Initialize filtered properties with all properties
      setFilteredProperties(properties);
      setHasNoMatchingProperties(false);

      console.log(`Loaded ${properties.length} properties`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load properties";
      setError(errorMessage);
      console.error("Error loading properties:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setFilteredProperties, setHasNoMatchingProperties]);

  /**
   * Applies filters to properties and updates the UI accordingly
   */
  const handleApplyFilters = useCallback(
    async (filters: FilterData) => {
      try {
        setIsLoading(true);
        setError(null);

        // Apply filters using the property filter service
        const filterResult = await propertyFilterService.applyFilters({
          query: searchQuery.trim(),
          filters,
          excludeFavorites: false, // We handle favorites filtering separately
        });

        // Update store with filtered results
        setAppliedFilters(filters);
        setFilteredProperties(filterResult.properties);
        setHasNoMatchingProperties(filterResult.filteredCount === 0);

        console.log("Applied filters:", filters);
        console.log(
          `Found ${filterResult.filteredCount} properties matching filters`
        );

        // Log warning if no properties match
        if (filterResult.filteredCount === 0) {
          console.warn("No properties match the applied filters");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to apply filters";
        setError(errorMessage);
        console.error("Error applying filters:", err);

        // Fallback: show all properties on error
        try {
          const allProperties =
            await renterPropertyService.getAllPublishedProperties();
          setFilteredProperties(allProperties);
          setHasNoMatchingProperties(false);
        } catch (fallbackErr) {
          console.error("Failed to load fallback properties:", fallbackErr);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      searchQuery,
      setAppliedFilters,
      setFilteredProperties,
      setHasNoMatchingProperties,
    ]
  );

  /**
   * Handles search functionality
   */
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      // If search is empty, reload all properties
      await loadInitialProperties();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const searchResult = await propertyFilterService.applyFilters({
        query: searchQuery.trim(),
        filters: appliedFilters,
        excludeFavorites: false,
      });

      setFilteredProperties(searchResult.properties);
      setHasNoMatchingProperties(searchResult.filteredCount === 0);

      console.log(
        `Search "${searchQuery}" found ${searchResult.filteredCount} properties`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Search failed";
      setError(errorMessage);
      console.error("Error searching properties:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    appliedFilters,
    setFilteredProperties,
    setHasNoMatchingProperties,
  ]);

  /**
   * Handles location detection
   */
  const handleLocationPress = useCallback(() => {
    console.log("Location detection requested");
    // TODO: Implement location detection
  }, []);

  /**
   * Handles property listing press
   */
  const handleListingPress = useCallback(
    (listingId: string) => {
      navigation.navigate("ListingDetails", { listingId });
    },
    [navigation]
  );

  /**
   * Handles booking press
   */
  const handleBookPress = useCallback(
    (listingId: string) => {
      navigation.navigate("Booking", { listingId });
    },
    [navigation]
  );

  /**
   * Handles favorite toggle
   */
  const handleFavoritePress = useCallback(
    (listingId: string) => {
      const propertyData = filteredProperties.find((p) => p.id === listingId);

      if (!propertyData) {
        console.warn(`Property with ID ${listingId} not found`);
        return;
      }

      if (isFavorite(listingId)) {
        removeFavorite(listingId);
        console.log("Removed from favorites:", propertyData.title);
      } else {
        addFavorite(propertyData);
        console.log("Added to favorites:", propertyData.title);
      }
    },
    [filteredProperties, isFavorite, addFavorite, removeFavorite]
  );

  /**
   * Handles hero press (for future implementation)
   */
  const handleHeroPress = useCallback((heroId: string) => {
    console.log("Hero pressed:", heroId);
    // TODO: Implement hero navigation
  }, []);

  /**
   * Handles filter sheet visibility
   */
  const handleFilterPress = useCallback(() => {
    setShowFilterSheet(true);
  }, []);

  /**
   * Handles filter sheet close
   */
  const handleFilterClose = useCallback(() => {
    setShowFilterSheet(false);
  }, []);

  /**
   * Handles view mode change
   */
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  /**
   * Memoized properties to show (filtered properties or fallback to all)
   */
  const propertiesToShow = useMemo(() => {
    return filteredProperties.length > 0 ? filteredProperties : [];
  }, [filteredProperties]);

  /**
   * Memoized filtered listings (excluding favorites)
   */
  const filteredListings = useMemo(() => {
    return propertiesToShow.filter((listing) => !isFavorite(listing.id));
  }, [propertiesToShow, isFavorite]);

  /**
   * Memoized property listings for the list view
   */
  const propertyListings: PropertyListing[] = useMemo(() => {
    return filteredListings.map((property: SwipeCardData) => ({
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      imageUrl: property.imageUrl,
      status: "available" as const,
      rating: property.rating || 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      isFavorite: isFavorite(property.id),
      amenities: ["WiFi", "Parking", "Pet Friendly"],
      bedrooms: property.rooms,
      bathrooms: property.bathrooms,
      size: property.size,
    }));
  }, [filteredListings, isFavorite]);

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

  // Render swipe mode
  if (viewMode === "swipe") {
    return (
      <>
        <SwipeDiscoveryScreen
          navigation={navigation}
          onFilterPress={handleFilterPress}
          onViewModeChange={handleViewModeChange}
        />
        <FilterBottomSheet
          visible={showFilterSheet}
          onClose={handleFilterClose}
          onApply={handleApplyFilters}
          initialFilters={appliedFilters}
        />
      </>
    );
  }

  // Render list mode
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <HomeHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onFilterPress={handleFilterPress}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search by city, address, or ZIP"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearchPress={handleSearch}
            onFilterPress={handleFilterPress}
            onLocationPress={handleLocationPress}
            showLocationButton
            hasActiveFilters={hasActiveFilters}
          />
        </View>

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Property Listings */}
        <PropertyListingsSection
          listings={propertyListings}
          onListingPress={handleListingPress}
          onBookPress={handleBookPress}
          onFavoritePress={handleFavoritePress}
        />
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showFilterSheet}
        onClose={handleFilterClose}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Extra padding for floating nav bar
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  errorContainer: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.error[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  errorText: {
    color: colors.error[700],
    textAlign: "center",
    fontWeight: "500",
  },
});
