import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useFavoritesStore } from "../../shared/hooks/state/favoritesStore";
import { SwipeCardData } from "./components/SwipeCard";
import {
  colors,
  spacing,
  textStyles,
  shadows,
  borderRadius,
  withOpacity,
} from "../../shared/constants/tokens";
import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";
import EmptyState from "../../shared/components/ui/EmptyState";
import AreaStories from "../../shared/components/ui/AreaStories";
import RequestButton from "../favorites/components/RequestButton";
import MakeRequestBottomSheet from "../favorites/MakeRequestBottomSheet";
import { TelAvivLocation } from "../../shared/constants/locations";
import { useRequestStore } from "../../shared/hooks/state/requestStore";

const { width } = Dimensions.get("window");

export default function FavoritesScreen({ navigation }: any) {
  const { favorites, removeFavorite } = useFavoritesStore();
  const { refreshRequest } = useRequestStore();
  const [selectedArea, setSelectedArea] = useState<TelAvivLocation | null>(
    null
  );
  const [requestBottomSheetVisible, setRequestBottomSheetVisible] =
    useState(false);
  const [selectedListing, setSelectedListing] = useState<SwipeCardData | null>(
    null
  );

  // Filter favorites based on selected area
  const filteredFavorites = useMemo(() => {
    if (!selectedArea) {
      return favorites;
    }
    return favorites.filter(
      (fav: SwipeCardData) => fav.location === selectedArea.name
    );
  }, [favorites, selectedArea]);

  const handleApartmentPress = (apartmentId: string) => {
    navigation.navigate("ListingDetails", { listingId: apartmentId });
  };

  const handleChatPress = (apartmentId: string) => {
    navigation.navigate("Chat", { listingId: apartmentId });
  };

  const handleRequestPress = (listing: SwipeCardData) => {
    setSelectedListing(listing);
    setRequestBottomSheetVisible(true);
  };

  const handleRemoveFavorite = (apartmentId: string) => {
    removeFavorite(apartmentId);
  };

  const handleAreaPress = (area: TelAvivLocation) => {
    // Toggle area selection - if same area is pressed, clear filter
    if (selectedArea?.id === area.id) {
      setSelectedArea(null);
    } else {
      setSelectedArea(area);
    }
  };

  const clearAreaFilter = () => {
    setSelectedArea(null);
  };

  // Refresh request data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const refreshAllRequests = async () => {
        for (const favorite of favorites) {
          try {
            await refreshRequest(favorite.id);
          } catch (error) {
            console.error(
              `Failed to refresh request for listing ${favorite.id}:`,
              error
            );
          }
        }
      };

      refreshAllRequests();
    }, [favorites, refreshRequest])
  );

  const renderFavoriteItem = ({ item }: { item: SwipeCardData }) => (
    <View style={styles.favoriteCard}>
      {/* Image container with overlays */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => handleApartmentPress(item.id)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

        {/* Location overlay at the top */}
        <View style={styles.locationOverlay}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>
            {item.location}
            {item.distance && `, ~${item.distance}`}
          </Text>
        </View>

        {/* Remove button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.removeIcon}>❤️</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Content below the image */}
      <View style={styles.cardContent}>
        <View style={styles.titlePriceRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.cardPrice}>${item.price}</Text>
            <Text style={styles.priceUnit}>/night</Text>
          </View>
        </View>

        {/* Request Button */}
        <View style={styles.requestButtonContainer}>
          <RequestButton
            listing={item}
            onPress={() => handleRequestPress(item)}
            style={styles.requestButton}
          />
        </View>
      </View>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <EmptyState
          icon="❤️"
          title="No favorites yet"
          subtitle="Start swiping right on apartments you like to save them here!"
          actionLabel="Start Browsing"
          onActionPress={() => navigation.navigate("Home")}
        />
      </SafeAreaView>
    );
  }

  if (filteredFavorites.length === 0 && selectedArea) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <AreaStories
          favorites={favorites}
          onAreaPress={handleAreaPress}
          selectedArea={selectedArea}
        />

        {/* Filter indicator */}
        <View style={styles.filterIndicator}>
          <Text style={styles.filterText}>
            Showing favorites in {selectedArea.name}
          </Text>
          <TouchableOpacity
            onPress={clearAreaFilter}
            style={styles.clearFilterButton}
          >
            <Text style={styles.clearFilterText}>Clear filter</Text>
          </TouchableOpacity>
        </View>

        <EmptyState
          icon="🏠"
          title="No favorites in this area"
          subtitle={`You don't have any saved apartments in ${selectedArea.name} yet.`}
          actionLabel="Clear Filter"
          onActionPress={clearAreaFilter}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AreaStories
        favorites={favorites}
        onAreaPress={handleAreaPress}
        selectedArea={selectedArea}
      />

      {/* Filter indicator */}
      {selectedArea && (
        <View style={styles.filterIndicator}>
          <Text style={styles.filterText}>
            Showing {filteredFavorites.length} favorite
            {filteredFavorites.length !== 1 ? "s" : ""} in {selectedArea.name}
          </Text>
          <TouchableOpacity
            onPress={clearAreaFilter}
            style={styles.clearFilterButton}
          >
            <Text style={styles.clearFilterText}>Clear filter</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredFavorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Request Bottom Sheet */}
      {selectedListing && (
        <MakeRequestBottomSheet
          visible={requestBottomSheetVisible}
          onClose={() => {
            setRequestBottomSheetVisible(false);
            setSelectedListing(null);
          }}
          listing={selectedListing}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: 120, // Extra padding for floating nav bar (80px height + 16px margin + 24px extra)
  },
  favoriteCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.lg,
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  locationOverlay: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: withOpacity(colors.neutral[0], "90"),
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    maxWidth: "50%",
    ...shadows.sm,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  locationText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "500",
    flex: 1,
  },
  removeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: withOpacity(colors.neutral[0], "90"),
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },
  removeIcon: {
    fontSize: 18,
  },
  cardContent: {
    padding: spacing.md,
  },
  titlePriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "700",
    fontSize: 16,
    flex: 1,
    marginRight: spacing.sm,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardPrice: {
    ...textStyles.h3,
    color: colors.primary[600],
    fontSize: 18,
    fontWeight: "700",
  },
  priceUnit: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  filterIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary[200],
  },
  filterText: {
    ...textStyles.caption,
    color: colors.primary[700],
    fontWeight: "500",
  },
  clearFilterButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary[100],
  },
  clearFilterText: {
    ...textStyles.caption,
    color: colors.primary[600],
    fontWeight: "600",
  },
  requestButtonContainer: {
    marginTop: spacing.sm,
    alignItems: "center",
  },
  requestButton: {
    minWidth: 120,
  },
});
