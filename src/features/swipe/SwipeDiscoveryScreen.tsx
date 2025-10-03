import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { SwipeCardData } from "./components/SwipeCard";
import SwipeStack from "./components/SwipeStack";
import SwipeEmptyState from "./components/PropertySwipeEmptyState";
import HomeHeader from "./components/HomeHeader";
import { colors } from "../../shared/constants/tokens";
import { useFavoritesStore } from "../../core/services/savedPropertiesStore";
import { useFilterStore } from "../../shared/hooks/state/filterStore";

interface SwipeDiscoveryScreenProps {
  navigation?: any;
  onFilterPress?: () => void;
  onViewModeChange?: (mode: "list" | "swipe") => void;
}

export default function SwipeDiscoveryScreen({
  navigation,
  onFilterPress,
  onViewModeChange,
}: SwipeDiscoveryScreenProps) {
  const [isEmpty, setIsEmpty] = useState(false);

  const { addFavorite, isFavorite } = useFavoritesStore();
  const { appliedFilters, isLoading, properties } = useFilterStore();

  // Update empty state when properties change
  useEffect(() => {
    const availableProperties = properties.filter(
      (apartment) => !isFavorite(apartment.id)
    );
    setIsEmpty(!isLoading && availableProperties.length === 0);
  }, [properties, isLoading, isFavorite]);

  // Filter out favorited apartments to get the swipe stack
  const apartments = React.useMemo(() => {
    if (isLoading) return []; // Don't filter while loading

    return properties.filter((apartment) => !isFavorite(apartment.id));
  }, [properties, isLoading, isFavorite]);

  // Initialize data when properties are loaded
  useEffect(() => {
    if (properties.length > 0 && !isLoading) {
      // Reset state when new data is loaded

      // Clear previous swipe history when new filters are applied
      const availableApartments = properties.filter(
        (apartment) => !isFavorite(apartment.id)
      );

      if (availableApartments.length > 0) {
        console.log(
          "Loaded",
          availableApartments.length,
          "properties for swiping"
        );
      }
    }
  }, [properties, isLoading, isFavorite]);

  const handleSwipe = (
    apartment: SwipeCardData,
    direction: "left" | "right",
    callback?: () => void
  ) => {
    console.log(
      `${direction === "left" ? "Passed" : "Liked"} apartment:`,
      apartment.title
    );

    if (direction === "right") {
      // Add to favorites
      addFavorite(apartment);
      console.log("Added to favorites:", apartment.title);
    } else {
      console.log("Passed:", apartment.title);
    }

    if (callback) {
      callback();
    }
  };

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <HomeHeader
          viewMode="swipe"
          onViewModeChange={onViewModeChange || (() => {})}
          onFilterPress={onFilterPress}
          hasActiveFilters={Object.keys(appliedFilters).length > 0}
        />
        <SwipeEmptyState
          onReload={() => {}}
          onChangeFilters={onFilterPress || (() => {})}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HomeHeader
        viewMode="swipe"
        onViewModeChange={onViewModeChange || (() => {})}
        onFilterPress={onFilterPress}
        hasActiveFilters={Object.keys(appliedFilters).length > 0}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          {/* Loading state - could add a spinner here */}
        </View>
      ) : (
        <SwipeStack
          data={apartments}
          onSwipeRight={(apartment) => handleSwipe(apartment, "right")}
          onSwipeLeft={(apartment) => handleSwipe(apartment, "left")}
          onSwipeUp={(apartment) => handleSwipe(apartment, "right")}
          onEmpty={() => setIsEmpty(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
