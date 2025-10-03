import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";
import { GenericCard } from "../../../shared/components/ui";

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
  bedrooms: number;
  bathrooms: number;
  size: number;
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
    <GenericCard
      id={item.id}
      title={item.title}
      subtitle={item.location}
      imageUrl={item.imageUrl}
      price={item.price}
      priceUnit="/night"
      rating={item.rating}
      reviewCount={item.reviewCount}
      status={item.status}
      stats={[
        { label: "Bedrooms", value: item.bedrooms, icon: "🛏️" },
        { label: "Bathrooms", value: item.bathrooms, icon: "🚿" },
        { label: "Size", value: `${item.size}m²`, icon: "📐" },
      ]}
      onPress={() => onListingPress(item.id)}
      onActionPress={() => onBookPress(item.id)}
      actionLabel="View Details"
      showStatus={true}
      showPrice={true}
      showRating={true}
      showStats={true}
      showActions={true}
      showFavorite={true}
      isFavorite={item.isFavorite}
      onFavoritePress={() => onFavoritePress(item.id)}
      variant="detailed"
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
