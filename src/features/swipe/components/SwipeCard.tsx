import React from "react";
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
  location: string;
  imageUrl: string;
  distance?: string;
  rating?: number;
  isFavorite?: boolean;
  rooms: number;
  bathrooms: number;
  size: number; // in square meters
  ownerId?: string;
  availableFrom?: string; // YYYY-MM-DD format
  availableTo?: string; // YYYY-MM-DD format
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
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Full Image Background */}
      <Image source={{ uri: data.imageUrl }} style={styles.image} />

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Favorite Button */}
      <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
        <Text style={styles.favoriteIcon}>{data.isFavorite ? "❤️" : "🤍"}</Text>
      </TouchableOpacity>

      {/* Content Overlay */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>
          <Text style={styles.price}>₪{data.price}/month</Text>
        </View>

        {/* Location */}
        <Text style={styles.location} numberOfLines={1}>
          📍 {data.location}
        </Text>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🛏️</Text>
            <Text style={styles.detailText}>{data.rooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🚿</Text>
            <Text style={styles.detailText}>{data.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📐</Text>
            <Text style={styles.detailText}>{data.size}m²</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.amenities}>
          {["WiFi", "Parking", "Pet Friendly"]
            .slice(0, 3)
            .map((amenity, index) => (
              <View key={index} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
        </View>

        {/* More Info Button */}
        <TouchableOpacity
          style={styles.moreInfoButton}
          onPress={onMoreInfoPress}
          activeOpacity={0.7}
        >
          <Text style={styles.moreInfoText}>More Info</Text>
          <Text style={styles.moreInfoIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth - spacing.sm * 2,
    height: 600,
    borderRadius: borderRadius.lg,
    ...shadows.lg,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
    zIndex: 2,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xl + spacing.md,
    zIndex: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[0],
    fontWeight: "800",
    flex: 1,
    marginRight: spacing.sm,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 28,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[300],
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 24,
  },
  location: {
    ...textStyles.body,
    color: colors.neutral[200],
    marginBottom: spacing.sm,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 16,
  },
  details: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    ...textStyles.body,
    color: colors.neutral[200],
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize: 14,
  },
  amenities: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  amenityChip: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  amenityText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
    fontSize: 12,
  },
  description: {
    ...textStyles.body,
    color: colors.neutral[600],
    lineHeight: 20,
  },
  moreInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  moreInfoText: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "700",
    fontSize: 16,
  },
  moreInfoIcon: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "700",
    fontSize: 18,
  },
});
