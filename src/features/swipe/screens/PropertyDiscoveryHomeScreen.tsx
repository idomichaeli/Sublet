import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../../../shared/constants/tokens";
import SearchBar from "../../../shared/components/ui/SearchBar";
import SwipeDiscoveryScreen from "../SwipeDiscoveryScreen";
import { useFavoritesStore } from "../../../core/services/savedPropertiesStore";
import HomeHeader from "../components/HomeHeader";
import PropertyListingsSection from "../components/PropertyListingsSection";
import FilterBottomSheet from "../components/FilterBottomSheet";
import { renterPropertyService } from "../../../core/services/renterPropertyService";
import { SwipeCardData } from "../components/SwipeCard";
import { FilterData } from "../types/FilterData";
import { useFilterStore } from "../../../shared/hooks/state/filterStore";

type ViewMode = "list" | "swipe";

export default function HomeScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<SwipeCardData[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("swipe");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { appliedFilters, setAppliedFilters } = useFilterStore();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const properties =
        await renterPropertyService.getAllPublishedProperties();
      setListings(properties);
    } catch (error) {
      console.error("Error loading properties:", error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out favorited apartments from the listings
  const filteredListings = listings.filter(
    (listing) => !isFavorite(listing.id)
  );

  const handleSearch = () => {
    // Implement search logic
    console.log("Searching for:", searchQuery);
  };

  const handleFilter = () => {
    setShowFilterSheet(true);
  };

  const handleApplyFilters = (filters: FilterData) => {
    setAppliedFilters(filters);
    console.log("Applied filters:", filters);
    // TODO: Implement actual filtering logic
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
    const propertyData = listings.find((p) => p.id === listingId);
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
          onViewModeChange={setViewMode}
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
          hasActiveFilters={Object.keys(appliedFilters).length > 0}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search by city, address, or ZIP"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearchPress={handleSearch}
            onFilterPress={handleFilter}
            onLocationPress={handleLocationPress}
            showLocationButton
            hasActiveFilters={Object.keys(appliedFilters).length > 0}
          />
        </View>

        {/* Convert SwipeCardData to Listing format for ListingsSection component */}
        <PropertyListingsSection
          listings={filteredListings.map((property: SwipeCardData) => ({
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
          }))}
          onListingPress={handleListingPress}
          onBookPress={handleBookPress}
          onFavoritePress={handleFavoritePress}
        />
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
