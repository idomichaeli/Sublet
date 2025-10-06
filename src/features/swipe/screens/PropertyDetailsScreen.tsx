import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";
import { OwnerProperty } from "../../../core/types/ownerPropertyList";
import { SwipeCardData } from "../components/SwipeCard";
import Button from "../../../shared/components/ui/Button";
import { useFavoritesStore } from "../../../core/services/savedPropertiesStore";
import { renterPropertyService } from "../../../core/services/renterPropertyService";
import {
  getPropertyAddress,
  getPropertyPrice,
  getPropertyDisplayName,
  getPropertySize,
} from "../../../core/types/propertyObjects/PropertyObject";

interface PropertyDetailsScreenProps {
  route: {
    params: {
      listingId: string;
    };
  };
  navigation: any;
}

const { width } = Dimensions.get("window");

export default function ListingDetailsScreen({
  route,
  navigation,
}: PropertyDetailsScreenProps) {
  const { listingId } = route.params || {};
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  // Find the property from real properties or mock data
  const [property, setProperty] = useState<OwnerProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setIsLoading(true);
        // Try to get the full property object first
        const fullProperty = await renterPropertyService.getPropertyById(
          listingId
        );

        if (fullProperty && fullProperty.status === "published") {
          setProperty(fullProperty);
        } else {
          setProperty(null);
        }
      } catch (error) {
        console.error("Error loading property:", error);
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [listingId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Property not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleShareProperty = async () => {
    try {
      await Share.share({
        message: `Check out this property: ${getPropertyDisplayName(
          property
        )} - ${getPropertyAddress(property)} - ${getPropertyPrice(property)}`,
        title: "Property Details",
      });
    } catch (error) {
      console.error("Error sharing property:", error);
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      // Convert OwnerProperty to SwipeCardData format
      const swipeCardData: SwipeCardData = {
        id: property.id,
        title: getPropertyDisplayName(property),
        price:
          parseFloat(getPropertyPrice(property).replace(/[^\d.]/g, "")) || 0,
        neighborhood: property.area?.name || "Unknown",
        location: getPropertyAddress(property),
        imageUrl: property.photos?.[0] || "",
        photos: property.photos || [],
        rooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        size: parseFloat(getPropertySize(property).replace(/[^\d.]/g, "")) || 0,
        floor: property.floor || "",
        hasShelter: property.hasShelter || false,
        ownerId: property.ownerId,
        availableFrom: property.availableFrom,
        availableTo: property.availableTo,
        description: "",
        propertyType: property.propertyType,
      };
      addFavorite(swipeCardData);
    }
  };

  const handleBookProperty = () => {
    navigation.navigate("Booking", { listingId: property.id });
  };

  const renderImageCarousel = () => {
    const photos =
      property.photos && property.photos.length > 0 ? property.photos : [];

    return (
      <View style={styles.imageCarousel}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Image indicators */}
        {photos.length > 1 && (
          <View style={styles.imageIndicators}>
            {photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral[0]} />
        </TouchableOpacity>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFavorite(property.id) ? "heart" : "heart-outline"}
            size={24}
            color={
              isFavorite(property.id) ? colors.error[500] : colors.neutral[0]
            }
          />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareProperty}
        >
          <Ionicons name="share-outline" size={24} color={colors.neutral[0]} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPropertyHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{getPropertyDisplayName(property)}</Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={18}
          color={colors.neutral[600]}
        />
        <Text style={styles.locationText}>{getPropertyAddress(property)}</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>
          {property.pricingFrequency === "week" ? "Weekly" : "Monthly"} Rent
        </Text>
        <Text style={styles.price}>
          ₪{property.price.toLocaleString()}/{property.pricingFrequency}
        </Text>
      </View>
    </View>
  );

  const renderPropertyDetails = () => (
    <View style={styles.detailsSection}>
      <Text style={styles.sectionTitle}>Property Details</Text>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons
              name="bed-outline"
              size={24}
              color={colors.primary[500]}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Bedrooms</Text>
            <Text style={styles.detailValue}>
              {property.customBedrooms || property.bedrooms}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons
              name="water-outline"
              size={24}
              color={colors.primary[500]}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Bathrooms</Text>
            <Text style={styles.detailValue}>
              {property.customBathrooms || property.bathrooms}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons
              name="resize-outline"
              size={24}
              color={colors.primary[500]}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Size</Text>
            <Text style={styles.detailValue}>{getPropertySize(property)}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons
              name="construct-outline"
              size={24}
              color={colors.primary[500]}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Renovation</Text>
            <Text style={styles.detailValue}>
              {property.renovation.charAt(0).toUpperCase() +
                property.renovation.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {property.isOneBedroomLivingRoom && (
        <View style={styles.specialNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.warning[500]}
          />
          <Text style={styles.specialNoteText}>
            One bedroom is used as a living room
          </Text>
        </View>
      )}
    </View>
  );

  const renderAvailability = () => {
    if (!property.availableFrom) {
      return null;
    }

    return (
      <View style={styles.availabilitySection}>
        <Text style={styles.sectionTitle}>Availability</Text>

        <View style={styles.availabilityContent}>
          <View style={styles.availabilityItem}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.success[500]}
            />
            <View style={styles.availabilityInfo}>
              <Text style={styles.availabilityLabel}>Available From</Text>
              <Text style={styles.availabilityValue}>
                {new Date(property.availableFrom).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {property.availableTo && (
            <View style={styles.availabilityItem}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.warning[500]}
              />
              <View style={styles.availabilityInfo}>
                <Text style={styles.availabilityLabel}>Available Until</Text>
                <Text style={styles.availabilityValue}>
                  {new Date(property.availableTo).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}

          {property.startDateFlexibility && (
            <View style={styles.availabilityItem}>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.primary[500]}
              />
              <View style={styles.availabilityInfo}>
                <Text style={styles.availabilityLabel}>
                  Start Date Flexibility:
                </Text>
                <Text style={styles.availabilityValue}>
                  {property.startDateFlexibility.replace(/_/g, " ")}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderAdditionalRooms = () => {
    if (!property.additionalRooms || property.additionalRooms.length === 0) {
      return null;
    }

    return (
      <View style={styles.additionalRoomsSection}>
        <Text style={styles.sectionTitle}>Additional Rooms</Text>
        <View style={styles.roomsList}>
          {property.additionalRooms.map((room, index) => (
            <View key={index} style={styles.roomTag}>
              <Text style={styles.roomTagText}>{room}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderShelterInfo = () => {
    if (!property.hasShelter) {
      return null;
    }

    return (
      <View style={styles.shelterSection}>
        <Text style={styles.sectionTitle}>Safety Information</Text>
        <View style={styles.shelterInfo}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={colors.success[500]}
          />
          <Text style={styles.shelterText}>
            Shelter available:{" "}
            {property.shelterLocation?.replace(/_/g, " ") || "In building"}
            {property.shelterDistance && ` (${property.shelterDistance}m away)`}
          </Text>
        </View>
      </View>
    );
  };

  const renderAmenities = () => {
    if (!property.amenities || property.amenities.length === 0) {
      return null;
    }

    const amenityIcons: { [key: string]: string } = {
      wifi: "wifi-outline",
      ac: "snow-outline",
      elevator: "business-outline",
      furnished: "bed-outline",
      pet_friendly: "paw-outline",
      smoking_allowed: "cigarette-outline",
      accessible: "accessibility-outline",
      parking: "car-outline",
      balcony: "leaf-outline",
      garden: "flower-outline",
      pool: "water-outline",
      gym: "fitness-outline",
    };

    return (
      <View style={styles.amenitiesSection}>
        <Text style={styles.sectionTitle}>Amenities</Text>

        <View style={styles.amenitiesGrid}>
          {property.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Ionicons
                name={
                  (amenityIcons[amenity] as any) || "checkmark-circle-outline"
                }
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles.amenityText}>
                {amenity
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderActions = () => (
    <View style={styles.actionsSection}>
      <Button
        title="Make an Offer"
        onPress={handleBookProperty}
        variant="primary"
        size="lg"
        style={styles.actionButton}
      />

      <Button
        title="Contact Owner"
        onPress={() => {
          // TODO: Navigate to chat or contact screen
          console.log("Contact owner");
        }}
        variant="secondary"
        size="lg"
        style={styles.actionButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {renderImageCarousel()}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderPropertyHeader()}
        {renderPropertyDetails()}
        {renderAdditionalRooms()}
        {renderShelterInfo()}
        {renderAmenities()}
        {renderAvailability()}
        {renderActions()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[0],
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  errorText: {
    ...textStyles.h2,
    color: colors.neutral[600],
    marginBottom: spacing.lg,
  },
  imageCarousel: {
    width: width,
    height: 300,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: withOpacity(colors.neutral[900], "60"),
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: withOpacity(colors.neutral[900], "60"),
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  shareButton: {
    position: "absolute",
    top: spacing.md + 54,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: withOpacity(colors.neutral[900], "60"),
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  headerSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    flex: 1,
    marginRight: spacing.md,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.warning[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  ratingText: {
    ...textStyles.caption,
    color: colors.warning[700],
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  locationText: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  priceLabel: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  price: {
    ...textStyles.h2,
    color: colors.primary[600],
    fontWeight: "700",
  },
  detailsSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
    fontWeight: "600",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flex: 1,
    minWidth: "45%",
    gap: spacing.sm,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  detailValue: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  availabilitySection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  availabilityContent: {
    gap: spacing.md,
  },
  availabilityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  availabilityValue: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  amenitiesSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  amenityText: {
    ...textStyles.caption,
    color: colors.success[700],
    fontWeight: "500",
  },
  actionsSection: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    width: "100%",
  },

  // Additional Rooms Section
  additionalRoomsSection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[50],
  },
  roomsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  roomTag: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  roomTagText: {
    ...textStyles.caption,
    color: colors.primary[700],
    fontWeight: "500",
  },

  // Shelter Info Section
  shelterSection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
  },
  shelterInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.success[50],
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  shelterText: {
    ...textStyles.body,
    color: colors.success[700],
    flex: 1,
  },

  // Special Note
  specialNote: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: withOpacity(colors.warning[500], "10"),
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  specialNoteText: {
    ...textStyles.caption,
    color: colors.warning[700],
    flex: 1,
  },

  // Image Indicators
  imageIndicators: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: withOpacity(colors.neutral[0], "50"),
  },
  activeIndicator: {
    backgroundColor: colors.neutral[0],
  },
});
