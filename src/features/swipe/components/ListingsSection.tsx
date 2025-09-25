import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";
import ApartmentCard from "../../../shared/components/ui/ApartmentCard";

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
}

interface ListingsSectionProps {
  listings: Listing[];
  onListingPress: (listingId: string) => void;
  onBookPress: (listingId: string) => void;
  onFavoritePress: (listingId: string) => void;
}

export default function ListingsSection({
  listings,
  onListingPress,
  onBookPress,
  onFavoritePress,
}: ListingsSectionProps) {
  const renderListing = ({ item }: { item: Listing }) => (
    <ApartmentCard
      {...item}
      onPress={() => onListingPress(item.id)}
      onBookPress={() => onBookPress(item.id)}
      onFavoritePress={() => onFavoritePress(item.id)}
      showBookButton
      showFavoriteButton={false}
    />
  );

  return (
    <View style={styles.listingsContainer}>
      <View style={styles.listingsHeader}>
        <Text style={styles.listingsTitle}>Available Apartments</Text>
        <Text style={styles.listingsCount}>{listings.length} properties</Text>
      </View>

      <FlatList
        data={listings}
        renderItem={renderListing}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listingsList}
      />
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
});
