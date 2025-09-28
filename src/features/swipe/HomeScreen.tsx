import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../../shared/constants/tokens";
import SearchBar from "../../shared/components/ui/SearchBar";
import SwipeDiscoveryScreen from "./SwipeDiscoveryScreen";
import { useFavoritesStore } from "../../shared/hooks/state/favoritesStore";
import HomeHeader from "./components/HomeHeader";
import HeroCarousel from "./components/HeroCarousel";
import QuickFilters from "./components/QuickFilters";
import ListingsSection from "./components/ListingsSection";
import FilterBottomSheet from "./components/FilterBottomSheet";
import { browserListings, heroData, quickFilters } from "./data/browserData";
import { FilterData } from "./types/FilterData";
import { useFilterStore } from "../../shared/hooks/state/filterStore";

type ViewMode = "list" | "swipe";

export default function HomeScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState(browserListings);
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("swipe");
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const { isFavorite } = useFavoritesStore();
  const { appliedFilters, setAppliedFilters } = useFilterStore();

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
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === listingId
          ? { ...listing, isFavorite: !listing.isFavorite }
          : listing
      )
    );
  };

  const handleHeroPress = (heroId: string) => {
    console.log("Hero pressed:", heroId);
    // Navigate to relevant section or apply filters
  };

  // If swipe mode is selected, render the swipe discovery screen
  if (viewMode === "swipe") {
    return (
      <>
        <SwipeDiscoveryScreen onFilterPress={handleFilter} />
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
      {/* <ScrollView
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
            hasActiveFilters={Object.keys(appliedFilters).length > 0}
          />
        </View>

        <QuickFilters
          filters={quickFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </ScrollView>

      <FilterBottomSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
      /> */}
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
