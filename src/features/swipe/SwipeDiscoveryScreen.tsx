import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native";
import { SwipeCardData } from "./components/SwipeCard";
import SwipeStack from "./components/SwipeStack";
import FloatingActionButtons from "./components/FloatingActionButtons";
import ProgressIndicator from "./components/ProgressIndicator";
import SwipeEmptyState from "./components/SwipeEmptyState";
import { mockApartments } from "../../shared/data/mockApartments";
import { colors, spacing } from "../../shared/constants/tokens";
import { useFavoritesStore } from "../../shared/hooks/state/favoritesStore";

export default function SwipeDiscoveryScreen() {
  const [apartments, setApartments] = useState<SwipeCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedApartments, setLikedApartments] = useState<SwipeCardData[]>([]);
  const [passedApartments, setPassedApartments] = useState<SwipeCardData[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const { addFavorite, isFavorite } = useFavoritesStore();

  // Filter out favorited apartments from mock data
  React.useEffect(() => {
    const filteredApartments = mockApartments.filter(
      (apartment) => !isFavorite(apartment.id)
    );
    setApartments(filteredApartments);
  }, [isFavorite]);

  const handleSwipeRight = (apartment: SwipeCardData) => {
    console.log("Liked apartment:", apartment.title);
    setLikedApartments((prev) => [...prev, apartment]);

    // Add to favorites store
    addFavorite(apartment);

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
    const filteredApartments = mockApartments.filter(
      (apartment) => !isFavorite(apartment.id)
    );
    setApartments(filteredApartments);
    setCurrentIndex(0);
    setLikedApartments([]);
    setPassedApartments([]);
    setIsEmpty(false);
  };

  const handleChangeFilters = () => {
    Alert.alert(
      "Change Filters",
      "Filter options would open here. For now, this is a placeholder.",
      [{ text: "OK" }]
    );
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

  const canUndo = likedApartments.length > 0 || passedApartments.length > 0;

  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.neutral[50]}
        />
        <SwipeEmptyState
          onReload={handleReload}
          onChangeFilters={handleChangeFilters}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral[50]} />

      {/* Progress Indicator */}
      <ProgressIndicator current={currentIndex} total={apartments.length} />

      {/* Swipe Stack */}
      <View style={styles.swipeContainer}>
        <SwipeStack
          data={apartments}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onEmpty={handleEmpty}
        />
      </View>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onSwipeLeft={handleManualSwipeLeft}
        onSwipeRight={handleManualSwipeRight}
        onUndo={handleUndo}
        canUndo={canUndo}
        disabled={currentIndex >= apartments.length}
      />
    </SafeAreaView>
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
  },
});
