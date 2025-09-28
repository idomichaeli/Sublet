import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
import {
  getPropertyAddress,
  getPropertyPrice,
  getPropertyRooms,
  getPropertySize,
  getPropertyDisplayName,
} from "../../../core/types/propertyObjects/PropertyObject";
import {
  getPropertyStatusLabel,
  getPropertyStatusColor,
  getPropertyStatusDescription,
} from "../../../core/types/ownerPropertyList";

interface PropertyDetailsScreenProps {
  route: {
    params: {
      property: OwnerProperty;
    };
  };
  navigation: any;
}

const { width, height } = Dimensions.get("window");

export default function PropertyDetailsScreen({
  route,
  navigation,
}: PropertyDetailsScreenProps) {
  const { property } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleEditProperty = () => {
    navigation.navigate("AddProperty", {
      editMode: true,
      propertyId: property.id,
    });
  };

  const handleShareProperty = async () => {
    try {
      await Share.share({
        message: `Check out this property: ${getPropertyAddress(
          property
        )} - ${getPropertyPrice(property)}`,
        title: "Property Details",
      });
    } catch (error) {
      console.error("Error sharing property:", error);
    }
  };

  const handleViewRenters = () => {
    navigation.navigate("InterestedRenters", { propertyId: property.id });
  };

  const handleDeleteProperty = () => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Handle delete logic here
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderImageCarousel = () => {
    if (!property.photos || property.photos.length === 0) {
      return (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="home-outline" size={64} color={colors.neutral[400]} />
          <Text style={styles.imagePlaceholderText}>No photos available</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {property.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Image indicators */}
        {property.photos.length > 1 && (
          <View style={styles.imageIndicators}>
            {property.photos.map((_, index) => (
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

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral[0]} />
        </TouchableOpacity>

        {/* Share button */}
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
        <Text style={styles.propertyTitle}>
          {getPropertyDisplayName(property)}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getPropertyStatusColor(property.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getPropertyStatusLabel(property.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.propertyAddress}>
        📍 {getPropertyAddress(property)}
      </Text>

      <Text style={styles.propertyPrice}>{getPropertyPrice(property)}</Text>
    </View>
  );

  const renderPropertyStats = () => (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Property Statistics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{property.views || 0}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{property.inquiries || 0}</Text>
          <Text style={styles.statLabel}>Inquiries</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{property.bookings || 0}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getPropertySize(property)}</Text>
          <Text style={styles.statLabel}>Size</Text>
        </View>
      </View>
    </View>
  );

  const renderPropertyDetails = () => (
    <View style={styles.detailsSection}>
      <Text style={styles.sectionTitle}>Property Details</Text>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Ionicons name="bed-outline" size={20} color={colors.primary[500]} />
          <Text style={styles.detailLabel}>Bedrooms</Text>
          <Text style={styles.detailValue}>
            {property.customBedrooms || property.bedrooms}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons
            name="water-outline"
            size={20}
            color={colors.primary[500]}
          />
          <Text style={styles.detailLabel}>Bathrooms</Text>
          <Text style={styles.detailValue}>
            {property.customBathrooms || property.bathrooms}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons
            name="resize-outline"
            size={20}
            color={colors.primary[500]}
          />
          <Text style={styles.detailLabel}>Size</Text>
          <Text style={styles.detailValue}>{getPropertySize(property)}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons
            name="construct-outline"
            size={20}
            color={colors.primary[500]}
          />
          <Text style={styles.detailLabel}>Renovation</Text>
          <Text style={styles.detailValue}>
            {property.renovation.charAt(0).toUpperCase() +
              property.renovation.slice(1)}
          </Text>
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

  const renderAvailability = () => {
    if (!property.availableFrom) {
      return null;
    }

    return (
      <View style={styles.availabilitySection}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <View style={styles.availabilityInfo}>
          <View style={styles.availabilityItem}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.primary[500]}
            />
            <Text style={styles.availabilityLabel}>Available from:</Text>
            <Text style={styles.availabilityValue}>
              {new Date(property.availableFrom).toLocaleDateString()}
            </Text>
          </View>

          {property.availableTo && (
            <View style={styles.availabilityItem}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles.availabilityLabel}>Available until:</Text>
              <Text style={styles.availabilityValue}>
                {new Date(property.availableTo).toLocaleDateString()}
              </Text>
            </View>
          )}

          {property.startDateFlexibility && (
            <View style={styles.availabilityItem}>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.primary[500]}
              />
              <Text style={styles.availabilityLabel}>
                Start date flexibility:
              </Text>
              <Text style={styles.availabilityValue}>
                {property.startDateFlexibility.replace(/_/g, " ")}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderActions = () => (
    <View style={styles.actionsSection}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={handleEditProperty}
      >
        <Ionicons name="create-outline" size={20} color={colors.neutral[0]} />
        <Text style={styles.actionButtonText}>Edit Property</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.viewRentersButton]}
        onPress={handleViewRenters}
      >
        <Ionicons name="people-outline" size={20} color={colors.neutral[0]} />
        <Text style={styles.actionButtonText}>View Renters</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={handleDeleteProperty}
      >
        <Ionicons name="trash-outline" size={20} color={colors.neutral[0]} />
        <Text style={styles.actionButtonText}>Delete Property</Text>
      </TouchableOpacity>
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
        {renderPropertyStats()}
        {renderPropertyDetails()}
        {renderAdditionalRooms()}
        {renderAmenities()}
        {renderShelterInfo()}
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

  // Image Carousel
  imageContainer: {
    height: height * 0.4,
    position: "relative",
  },
  propertyImage: {
    width: width,
    height: "100%",
  },
  imagePlaceholder: {
    width: width,
    height: "100%",
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginTop: spacing.sm,
  },
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
  backButton: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: withOpacity(colors.neutral[900], "30"),
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: withOpacity(colors.neutral[900], "30"),
    justifyContent: "center",
    alignItems: "center",
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing["2xl"],
  },

  // Header Section
  headerSection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  propertyTitle: {
    ...textStyles.h2,
    color: colors.neutral[900],
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  propertyAddress: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  propertyPrice: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "700",
  },

  // Stats Section
  statsSection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[50],
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.neutral[0],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.sm,
  },
  statValue: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "700",
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },

  // Details Section
  detailsSection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  detailItem: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  detailLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    flex: 1,
  },
  detailValue: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
  },
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

  // Additional Rooms
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

  // Amenities
  amenitiesSection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  amenityItem: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  amenityText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    flex: 1,
  },

  // Shelter Info
  shelterSection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[50],
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

  // Availability
  availabilitySection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
  },
  availabilityInfo: {
    gap: spacing.sm,
  },
  availabilityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  availabilityLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    flex: 1,
  },
  availabilityValue: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
  },

  // Actions
  actionsSection: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[50],
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  editButton: {
    backgroundColor: colors.primary[500],
  },
  viewRentersButton: {
    backgroundColor: colors.secondary[500],
  },
  deleteButton: {
    backgroundColor: colors.error[500],
  },
  actionButtonText: {
    ...textStyles.button,
    color: colors.neutral[0],
  },
});
