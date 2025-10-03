import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../../shared/constants/tokens";
import SearchBar from "../../shared/components/ui/SearchBar";
import SwipeDiscoveryScreen from "./SwipeDiscoveryScreen";
import { useFavoritesStore } from "../../core/services/savedPropertiesStore";
import HomeHeader from "./components/HomeHeader";
import HeroCarousel from "./components/HeroCarousel";
import QuickFilters from "./components/PropertyQuickFilters";
import ListingsSection from "./components/PropertyListingsSection";
import FilterBottomSheet from "./components/FilterBottomSheet";
import { FilterData } from "./types/FilterData";
import { useFilterStore } from "../../shared/hooks/state/filterStore";
import { Listing } from "./components/PropertyListingsSection";
import { SwipeCardData } from "./components/SwipeCard";
import { useSafeAsync } from "../../shared/hooks/useSafeAsync";

type ViewMode = "list" | "swipe";

export default function HomeScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("swipe");
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const {
    appliedFilters,
    searchQuery,
    isLoading,
    properties,
    filteredCount,
    appliedFiltersCount,
    setSearchQuery,
    setAppliedFilters,
  } = useFilterStore();

  // Safe async operations to prevent crashes on unmount
  const { executeIfMounted } = useSafeAsync();

  useEffect(() => {
    // Trigger initial load
    setAppliedFilters({});
  }, []);

  // Convert SwipeCardData to Listing format for ListingsSection component
  const formatListings = (swipeProperties: SwipeCardData[]): Listing[] => {
    return swipeProperties.map((property: SwipeCardData) => ({
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      imageUrl: property.imageUrl,
      status: "available" as const,
      rating: property.rating || 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      isFavorite: isFavorite(property.id), // Check favorites store instead of property
      amenities: ["WiFi", "Parking", "Pet Friendly"], // Default amenities for now
      bedrooms: property.rooms,
      bathrooms: property.bathrooms,
      size: property.size,
    }));
  };

  // Filter out favorited apartments from the listings
  const listings = formatListings(properties);
  const filteredListings = listings.filter(
    (listing) => !isFavorite(listing.id)
  );

  const handleSearch = () => {
    // Search is now handled automatically through the filter store
    console.log("Searching for:", searchQuery);
  };

  const handleFilter = () => {
    setShowFilterSheet(true);
  };

  const handleApplyFilters = (filters: FilterData) => {
    executeIfMounted(() => {
      setAppliedFilters(filters);
      setShowFilterSheet(false);
      console.log(
        "Filters applied successfully. Found",
        filteredCount,
        "properties"
      );
    });
  };

  const handleLocationPress = () => {
    // Implement location detection
    console.log("Detecting location");
  };

  const handleListingPress = (listingId: string) => {
    navigation.navigate("ListingDetails", { listingId });
  };

  const handleBookPress = (listingId: string) => {
    navigation.navigate("Booking", { listingId });
  };

  const handleFavoritePress = (listingId: string) => {
    // Find the property data to add to favorites
    const propertyData = properties.find((p) => p.id === listingId);
    if (propertyData) {
      if (isFavorite(listingId)) {
        removeFavorite(listingId);
        console.log("Removed from favorites:", propertyData.title);
      } else {
        addFavorite(propertyData);
        console.log("Added to favorites:", propertyData.title);
      }
    }
  };

  const handleHeroPress = (heroId: string) => {
    console.log("Hero pressed:", heroId);
    // Navigate to relevant section or apply filters
  };

  // If swipe mode is selected, render the swipe discovery screen
  if (viewMode === "swipe") {
    return (
      <>
        <SwipeDiscoveryScreen
          navigation={navigation}
          onFilterPress={handleFilter}
        />
        <FilterBottomSheet
          visible={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          onApply={handleApplyFilters}
          initialFilters={appliedFilters}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFilterPress={handleFilter}
          hasActiveFilters={appliedFiltersCount > 0}
        />

        <ListingsSection
          listings={filteredListings}
          onListingPress={handleListingPress}
          onBookPress={handleBookPress}
          onFavoritePress={handleFavoritePress}
        />

        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search by city, address, or ZIP"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearchPress={handleSearch}
            onFilterPress={handleFilter}
            onLocationPress={handleLocationPress}
            showLocationButton
            hasActiveFilters={appliedFiltersCount > 0}
          />
        </View>

        {/* <QuickFilters
          filters={quickFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        /> */}
      </ScrollView>

      <FilterBottomSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
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
    paddingBottom: 120, // Extra padding for floating nav bar (80px height + 16px margin + 24px extra)
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
});
