import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

const { width: screenWidth } = Dimensions.get("window");

export interface SwipeCardData {
  id: string;
  title: string;
  price: number;
  neighborhood: string; // Neighborhood/area name
  location: string; // Full address location
  imageUrl: string; // Keep for backward Compatibility
  photos?: string[]; // Array of photo URLs
  distance?: string;
  rating?: number;
  isFavorite?: boolean;
  rooms: number;
  bathrooms: number;
  size: number; // in square meters
  floor: string; // Floor information
  hasShelter: boolean; // Whether apartment has shelter
  ownerId?: string;
  availableFrom?: string; // YYYY-MM-DD format
  availableTo?: string; // YYYY-MM-DD format
  description?: string; // Property description
  propertyType?: string; // Type of property (apartment, house, etc.)
}

interface SwipeCardProps {
  data: SwipeCardData;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onMoreInfoPress?: () => void;
}

export default function SwipeCard({
  data,
  onPress,
  onFavoritePress,
  onMoreInfoPress,
}: SwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Get photos array, fallback to imageUrl for backward compatibility
  const photos =
    data.photos && data.photos.length > 0 ? data.photos : [data.imageUrl];
  const currentPhoto = photos[currentPhotoIndex];

  const handleImagePress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const imageWidth = screenWidth - spacing.sm * 2;

    // If tap is on the right side of the image, go to next photo
    if (locationX > imageWidth / 2 && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
    // If tap is on the left side of the image, go to previous photo
    else if (locationX <= imageWidth / 2 && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full Image Background */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleImagePress}
        activeOpacity={1}
      >
        <Image source={{ uri: currentPhoto }} style={styles.image} />

        {/* Photo indicators - Top center */}
        {photos.length > 1 && (
          <View style={styles.photoIndicators}>
            {photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.photoIndicator,
                  index === currentPhotoIndex && styles.activePhotoIndicator,
                ]}
              />
            ))}
          </View>
        )}

        {/* Bedroom and Bathroom Tags - Top Right */}
        <View style={styles.roomTagsContainer}>
          <View style={styles.roomTag}>
            <Text style={styles.roomTagIcon}>🛏</Text>
            <Text style={styles.roomTagText}>{data.rooms}</Text>
          </View>
          <View style={styles.roomTag}>
            <Text style={styles.roomTagIcon}>🛁</Text>
            <Text style={styles.roomTagText}>{data.bathrooms}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Bottom Content Overlay */}
      <View style={styles.bottomContent}>
        {/* Location */}
        <Text style={styles.locationText}>{data.neighborhood}</Text>

        {/* Price */}
        <Text style={styles.priceText}>₪{data.price.toLocaleString()}/mo</Text>

        {/* Bottom Tags Row */}
        <View style={styles.bottomTagsContainer}>
          {/* Floor Tag */}
          <View style={styles.bottomTag}>
            <Text style={styles.bottomTagIcon}>🏢</Text>
            <Text style={styles.bottomTagText}>Floor {data.floor}</Text>
          </View>

          {/* Size Tag */}
          <View style={styles.bottomTag}>
            <Text style={styles.bottomTagIcon}>📐</Text>
            <Text style={styles.bottomTagText}>{data.size} m²</Text>
          </View>

          {/* New Badge */}
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeIcon}>✨</Text>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth - spacing.sm * 2,
    height: 600,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // Photo indicators at the top center
  photoIndicators: {
    position: "absolute",
    top: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  photoIndicator: {
    width: 8,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activePhotoIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 16,
  },
  // Room tags in top right
  roomTagsContainer: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: "column",
    gap: spacing.xs,
  },
  roomTag: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 45,
    justifyContent: "center",
  },
  roomTagIcon: {
    fontSize: 14,
  },
  roomTagText: {
    ...textStyles.caption,
    color: colors.neutral[900],
    fontWeight: "600",
    fontSize: 12,
  },
  // Bottom content overlay
  bottomContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  locationText: {
    ...textStyles.h3,
    color: colors.neutral[0],
    fontWeight: "600",
    marginBottom: spacing.xs,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 16,
  },
  priceText: {
    ...textStyles.h2,
    color: colors.neutral[0],
    fontWeight: "700",
    marginBottom: spacing.md,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 20,
  },
  bottomTagsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  bottomTag: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  bottomTagIcon: {
    fontSize: 12,
    color: colors.neutral[0],
  },
  bottomTagText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
    fontSize: 11,
  },
  newBadge: {
    backgroundColor: colors.success[500],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  newBadgeIcon: {
    fontSize: 10,
    color: colors.neutral[0],
  },
  newBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "700",
    fontSize: 10,
  },
});
