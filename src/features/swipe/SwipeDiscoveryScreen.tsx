import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet, StatusBar } from "react-native";

// Core imports
import { colors } from "../../shared/constants/tokens";
import { SwipeCardData } from "./components/SwipeCard";

// Service imports
import { useFavoritesStore } from "../../core/services/savedPropertiesStore";
import { useFilterStore } from "../../core/services/propertyFilterStore";
import { propertyFilterService } from "../../core/services/propertyFilterService";

// Component imports
import SwipeStack from "./components/SwipeStack";
import SwipeEmptyState from "./components/PropertySwipeEmptyState";
import HomeHeader from "./components/HomeHeader";

// Types
interface SwipeDiscoveryScreenProps {
  navigation?: any;
  onFilterPress?: () => void;
  onViewModeChange?: (mode: "list" | "swipe") => void;
}

/**
 * Swipe discovery screen that handles property swiping with comprehensive filtering
 * and empty state management
 */
export default function SwipeDiscoveryScreen({
  navigation,
  onFilterPress,
  onViewModeChange,
}: SwipeDiscoveryScreenProps) {
  // Local state
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [isLoadingProperties, setIsLoadingProperties] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Store hooks
  const { addFavorite, isFavorite } = useFavoritesStore();
  const {
    appliedFilters,
    isLoading,
    properties,
    filteredProperties,
    setFilteredProperties,
    hasNoMatchingProperties,
    setHasNoMatchingProperties,
  } = useFilterStore();

  /**
   * Applies filters when appliedFilters change
   */
  const applyFilters = useCallback(async () => {
    if (Object.keys(appliedFilters).length === 0) {
      // No filters applied, use all properties
      setFilteredProperties(properties);
      setHasNoMatchingProperties(false);
      return;
    }

    try {
      setIsLoadingProperties(true);
      setError(null);

      const filterResult = await propertyFilterService.applyFilters({
        query: "",
        filters: appliedFilters,
        excludeFavorites: false, // We handle favorites filtering separately
      });

      setFilteredProperties(filterResult.properties);
      setHasNoMatchingProperties(filterResult.filteredCount === 0);

      console.log(
        `Applied filters: ${filterResult.filteredCount} properties found`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to apply filters";
      setError(errorMessage);
      console.error("Error applying filters:", err);

      // Fallback: show all properties on error
      setFilteredProperties(properties);
      setHasNoMatchingProperties(false);
    } finally {
      setIsLoadingProperties(false);
    }
  }, [
    appliedFilters,
    properties,
    setFilteredProperties,
    setHasNoMatchingProperties,
  ]);

  // Apply filters when appliedFilters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  /**
   * Updates empty state when filtered properties change
   */
  const updateEmptyState = useCallback(() => {
    const availableProperties = filteredProperties.filter(
      (apartment) => !isFavorite(apartment.id)
    );
    setIsEmpty(!isLoadingProperties && availableProperties.length === 0);
  }, [filteredProperties, isLoadingProperties, isFavorite]);

  // Update empty state when dependencies change
  useEffect(() => {
    updateEmptyState();
  }, [updateEmptyState]);

  /**
   * Memoized apartments for swiping (excluding favorites)
   */
  const apartments = useMemo(() => {
    if (isLoadingProperties) return []; // Don't filter while loading

    return filteredProperties.filter((apartment) => !isFavorite(apartment.id));
  }, [filteredProperties, isLoadingProperties, isFavorite]);

  /**
   * Handles swipe actions (left, right, up)
   */
  const handleSwipe = useCallback(
    (
      apartment: SwipeCardData,
      direction: "left" | "right",
      callback?: () => void
    ) => {
      const action = direction === "left" ? "Passed" : "Liked";
      console.log(`${action} apartment:`, apartment.title);

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
    },
    [addFavorite]
  );

  /**
   * Handles swipe right (like)
   */
  const handleSwipeRight = useCallback(
    (apartment: SwipeCardData) => {
      handleSwipe(apartment, "right");
    },
    [handleSwipe]
  );

  /**
   * Handles swipe left (pass)
   */
  const handleSwipeLeft = useCallback(
    (apartment: SwipeCardData) => {
      handleSwipe(apartment, "left");
    },
    [handleSwipe]
  );

  /**
   * Handles swipe up (like)
   */
  const handleSwipeUp = useCallback(
    (apartment: SwipeCardData) => {
      handleSwipe(apartment, "right");
    },
    [handleSwipe]
  );

  /**
   * Handles empty state when no more cards
   */
  const handleEmpty = useCallback(() => {
    setIsEmpty(true);
  }, []);

  /**
   * Handles reload action
   */
  const handleReload = useCallback(async () => {
    try {
      setIsLoadingProperties(true);
      setError(null);
      await applyFilters();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reload";
      setError(errorMessage);
      console.error("Error reloading:", err);
    } finally {
      setIsLoadingProperties(false);
    }
  }, [applyFilters]);

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
   * Memoized loading state
   */
  const isCurrentlyLoading = useMemo(() => {
    return isLoading || isLoadingProperties;
  }, [isLoading, isLoadingProperties]);

  // Render empty state
  if (isEmpty) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <HomeHeader
          viewMode="swipe"
          onViewModeChange={onViewModeChange || (() => {})}
          onFilterPress={onFilterPress}
          hasActiveFilters={hasActiveFilters}
        />
        <SwipeEmptyState
          onReload={handleReload}
          onChangeFilters={onFilterPress || (() => {})}
        />
      </View>
    );
  }

  // Render main swipe interface
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <HomeHeader
        viewMode="swipe"
        onViewModeChange={onViewModeChange || (() => {})}
        onFilterPress={onFilterPress}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Loading State */}
      {isCurrentlyLoading ? (
        <View style={styles.loadingContainer}>
          {/* TODO: Add loading spinner component */}
        </View>
      ) : (
        /* Swipe Stack */
        <SwipeStack
          data={apartments}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onSwipeUp={handleSwipeUp}
          onEmpty={handleEmpty}
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
