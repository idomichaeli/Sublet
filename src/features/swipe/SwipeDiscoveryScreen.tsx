import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SwipeCardData } from "./components/SwipeCard";
import SwipeStack from "./components/SwipeStack";
import SwipeEmptyState from "./components/PropertySwipeEmptyState";
import HomeHeader from "./components/HomeHeader";
import { browserApartments } from "./data/browserData";
import { colors, spacing } from "../../shared/constants/tokens";
import { useFavoritesStore } from "../../shared/hooks/state/favoritesStore";
import { useFilterStore } from "../../shared/hooks/state/filterStore";

interface SwipeDiscoveryScreenProps {
  onFilterPress?: () => void;
  onViewModeChange?: (mode: "list" | "swipe") => void;
}

export default function SwipeDiscoveryScreen({
  onFilterPress,
  onViewModeChange,
}: SwipeDiscoveryScreenProps) {
  const [apartments, setApartments] = useState<SwipeCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedApartments, setLikedApartments] = useState<SwipeCardData[]>([]);
  const [passedApartments, setPassedApartments] = useState<SwipeCardData[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const { addFavorite, isFavorite } = useFavoritesStore();
  const { appliedFilters } = useFilterStore();

  // Filter out favorited apartments from mock data and apply filters
  React.useEffect(() => {
    let filteredApartments = browserApartments.filter(
      (apartment) => !isFavorite(apartment.id)
    );

    // Apply filters if any are set
    if (Object.keys(appliedFilters).length > 0) {
      filteredApartments = filteredApartments.filter((apartment) => {
        // Bedrooms filter
        if (
          appliedFilters.bedrooms &&
          apartment.rooms < appliedFilters.bedrooms
        ) {
          return false;
        }

        // Bathrooms filter
        if (
          appliedFilters.bathrooms &&
          apartment.bathrooms < appliedFilters.bathrooms
        ) {
          return false;
        }

        // Living room filter
        if (appliedFilters.hasLivingRoom !== undefined) {
          const hasLivingRoom =
            ["Living Room", "Kitchen", "Balcony"]?.includes("Living Room") ||
            false;
          if (appliedFilters.hasLivingRoom && !hasLivingRoom) {
            return false;
          }
          if (appliedFilters.hasLivingRoom === false && hasLivingRoom) {
            return false;
          }
        }

        // Size filter
        if (appliedFilters.minSize && apartment.size < appliedFilters.minSize) {
          return false;
        }
        if (appliedFilters.maxSize && apartment.size > appliedFilters.maxSize) {
          return false;
        }

        // Price filter
        if (
          appliedFilters.minPrice &&
          apartment.price < appliedFilters.minPrice
        ) {
          return false;
        }
        if (
          appliedFilters.maxPrice &&
          apartment.price > appliedFilters.maxPrice
        ) {
          return false;
        }

        // Amenities filter
        if (appliedFilters.amenities && appliedFilters.amenities.length > 0) {
          const apartmentAmenities = ["WiFi", "Parking", "Pet Friendly"];
          const hasAllRequiredAmenities = appliedFilters.amenities.every(
            (amenity) => apartmentAmenities.includes(amenity)
          );
          if (!hasAllRequiredAmenities) {
            return false;
          }
        }

        return true;
      });
    }

    setApartments(filteredApartments);
  }, [isFavorite, appliedFilters]);

  const handleSwipeRight = (apartment: SwipeCardData) => {
    console.log("Liked apartment:", apartment.title);
    setLikedApartments((prev) => [...prev, apartment]);

    // Add to favorites store
    addFavorite(apartment.id);

    // Update the apartment as favorite
    setApartments((prev) =>
      prev.map((apt) =>
        apt.id === apartment.id ? { ...apt, isFavorite: true } : apt
      )
    );
  };

  const handleSwipeLeft = (apartment: SwipeCardData) => {
    console.log("Passed apartment:", apartment.title);
    setPassedApartments((prev) => [...prev, apartment]);
  };

  const handleEmpty = () => {
    setIsEmpty(true);
  };

  const handleReload = () => {
    // Reset the state and reload apartments (filtered)
    let filteredApartments = browserApartments.filter(
      (apartment) => !isFavorite(apartment.id)
    );

    // Reapply filters
    if (Object.keys(appliedFilters).length > 0) {
      filteredApartments = filteredApartments.filter((apartment) => {
        // Apply the same filtering logic as in useEffect
        if (
          appliedFilters.bedrooms &&
          apartment.rooms < appliedFilters.bedrooms
        ) {
          return false;
        }
        if (
          appliedFilters.bathrooms &&
          apartment.bathrooms < appliedFilters.bathrooms
        ) {
          return false;
        }
        if (appliedFilters.hasLivingRoom !== undefined) {
          const hasLivingRoom =
            ["Living Room", "Kitchen", "Balcony"]?.includes("Living Room") ||
            false;
          if (appliedFilters.hasLivingRoom && !hasLivingRoom) {
            return false;
          }
          if (appliedFilters.hasLivingRoom === false && hasLivingRoom) {
            return false;
          }
        }
        if (appliedFilters.minSize && apartment.size < appliedFilters.minSize) {
          return false;
        }
        if (appliedFilters.maxSize && apartment.size > appliedFilters.maxSize) {
          return false;
        }
        if (
          appliedFilters.minPrice &&
          apartment.price < appliedFilters.minPrice
        ) {
          return false;
        }
        if (
          appliedFilters.maxPrice &&
          apartment.price > appliedFilters.maxPrice
        ) {
          return false;
        }
        if (appliedFilters.amenities && appliedFilters.amenities.length > 0) {
          const apartmentAmenities = ["WiFi", "Parking", "Pet Friendly"];
          const hasAllRequiredAmenities = appliedFilters.amenities.every(
            (amenity) => apartmentAmenities.includes(amenity)
          );
          if (!hasAllRequiredAmenities) {
            return false;
          }
        }
        return true;
      });
    }

    setApartments(filteredApartments);
    setCurrentIndex(0);
    setLikedApartments([]);
    setPassedApartments([]);
    setIsEmpty(false);
  };

  const handleChangeFilters = () => {
    onFilterPress?.();
  };

  const handleUndo = () => {
    if (likedApartments.length > 0) {
      const lastLiked = likedApartments[likedApartments.length - 1];
      setLikedApartments((prev) => prev.slice(0, -1));
      setApartments((prev) => [lastLiked, ...prev]);
      setCurrentIndex(0);
      setIsEmpty(false);
    } else if (passedApartments.length > 0) {
      const lastPassed = passedApartments[passedApartments.length - 1];
      setPassedApartments((prev) => prev.slice(0, -1));
      setApartments((prev) => [lastPassed, ...prev]);
      setCurrentIndex(0);
      setIsEmpty(false);
    }
  };

  const handleManualSwipeLeft = () => {
    if (currentIndex < apartments.length) {
      handleSwipeLeft(apartments[currentIndex]);
    }
  };

  const handleManualSwipeRight = () => {
    if (currentIndex < apartments.length) {
      handleSwipeRight(apartments[currentIndex]);
    }
  };

  const handleSwipeUp = (apartment: SwipeCardData) => {
    console.log("More info for apartment:", apartment.title);
    // TODO: Navigate to apartment details screen
    // navigation.navigate("ListingDetails", { listingId: apartment.id });
  };

  const canUndo = likedApartments.length > 0 || passedApartments.length > 0;

  if (isEmpty) {
    return (
      <>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.neutral[50]}
        />
        <SwipeEmptyState
          onReload={handleReload}
          onChangeFilters={handleChangeFilters}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral[50]} />

      {/* HomeHeader */}
      <HomeHeader
        viewMode="swipe"
        onViewModeChange={onViewModeChange || (() => {})}
        onFilterPress={onFilterPress}
        hasActiveFilters={Object.keys(appliedFilters).length > 0}
        remainingCount={apartments.length}
      />

      {/* Progress Indicator */}
      {/* <ProgressIndicator current={currentIndex} total={apartments.length} /> */}

      {/* Swipe Stack */}
      <View style={styles.swipeContainer}>
        <SwipeStack
          data={apartments}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onSwipeUp={handleSwipeUp}
          onEmpty={handleEmpty}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  swipeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120, // Account for tab bar height (80px) + margin (16px) + extra spacing (24px)
  },
});
