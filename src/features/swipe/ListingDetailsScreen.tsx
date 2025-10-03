import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../shared/constants/tokens";
import { renterPropertyService } from "../../core/services/renterPropertyService";
import { SwipeCardData } from "./components/SwipeCard";

interface ListingDetailsScreenProps {
  route: {
    params: {
      listingId: string;
    };
  };
  navigation: any;
}

export default function ListingDetailsScreen({
  route,
  navigation,
}: ListingDetailsScreenProps) {
  const { listingId } = route.params;
  const [listing, setListing] = useState<SwipeCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPropertyDetails();
  }, [listingId]);

  const loadPropertyDetails = async () => {
    try {
      setIsLoading(true);

      // Get property details from real API
      const properties =
        await renterPropertyService.getAllPublishedProperties();
      const property = properties.find((apt) => apt.id === listingId);
      setListing(property || null);
    } catch (error) {
      console.error("Error loading property details:", error);
      setListing(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Listing not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          {listing.imageUrl ? (
            <Image
              source={{ uri: listing.imageUrl }}
              style={styles.propertyImage}
            />
          ) : (
            <Text style={styles.imagePlaceholder}>📷</Text>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.location}>📍 {listing.location}</Text>
          <Text style={styles.price}>₪{listing.price}/month</Text>

          <View style={styles.specs}>
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>🛏️</Text>
              <Text style={styles.specText}>{listing.rooms} bedrooms</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>🚿</Text>
              <Text style={styles.specText}>{listing.bathrooms} bathrooms</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>📐</Text>
              <Text style={styles.specText}>{listing.size}m²</Text>
            </View>
          </View>

          <Text style={styles.description}>
            {listing.ownerId
              ? `Beautiful property in ${listing.location}. This property is managed by a verified owner.`
              : `Beautiful apartment in ${listing.location}`}
          </Text>

          <View style={styles.amenities}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenityList}>
              {["WiFi", "Parking", "Pet Friendly"].map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate("Booking", { listingId })}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonText: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "500",
  },
  imageContainer: {
    height: 250,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    fontSize: 48,
    color: colors.neutral[400],
  },
  propertyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  details: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    marginTop: spacing.md,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  location: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[600],
    fontWeight: "600",
    marginBottom: spacing.lg,
  },
  specs: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  specIcon: {
    fontSize: 16,
  },
  specText: {
    ...textStyles.body,
    color: colors.neutral[700],
  },
  description: {
    ...textStyles.body,
    color: colors.neutral[700],
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  amenities: {
    marginBottom: spacing.lg,
  },
  amenityList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  amenityChip: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  amenityText: {
    ...textStyles.caption,
    color: colors.primary[700],
    fontWeight: "500",
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  bookButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  bookButtonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    ...textStyles.h3,
    color: colors.neutral[600],
  },
});
