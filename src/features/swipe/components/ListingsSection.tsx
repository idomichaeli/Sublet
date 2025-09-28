import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../../shared/constants/tokens";

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  amenities: string[];
  isFavorite?: boolean;
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
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Available Apartments</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {listings.map((listing) => (
          <TouchableOpacity
            key={listing.id}
            style={styles.listingCard}
            onPress={() => onListingPress(listing.id)}
          >
            <View style={styles.imageContainer}>
              <Text style={styles.imagePlaceholder}>🏠</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => onFavoritePress(listing.id)}
              >
                <Text style={styles.favoriteIcon}>
                  {listing.isFavorite ? "❤️" : "🤍"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>
                {listing.title}
              </Text>
              <Text style={styles.location} numberOfLines={1}>
                📍 {listing.location}
              </Text>
              <Text style={styles.price}>₪{listing.price}/month</Text>

              <View style={styles.details}>
                <Text style={styles.detail}>🛏️ {listing.bedrooms}</Text>
                <Text style={styles.detail}>🚿 {listing.bathrooms}</Text>
                <Text style={styles.detail}>📐 {listing.size}m²</Text>
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => onBookPress(listing.id)}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  listingCard: {
    width: 280,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  imageContainer: {
    height: 150,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imagePlaceholder: {
    fontSize: 32,
    color: colors.neutral[400],
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[0],
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 16,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  location: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[600],
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  details: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detail: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  bookButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  bookButtonText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
  },
});
