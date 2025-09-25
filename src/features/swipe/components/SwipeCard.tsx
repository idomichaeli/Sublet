import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";
import { useFavoritesStore } from "../../../shared/hooks/state/favoritesStore";

const { width, height } = Dimensions.get("window");

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
  onFavoritePress?: () => void;
  style?: any;
}

export default function SwipeCard({
  data,
  onFavoritePress,
  style,
}: SwipeCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const isApartmentFavorite = isFavorite(data.id);

  const handleFavoritePress = () => {
    if (isApartmentFavorite) {
      removeFavorite(data.id);
    } else {
      addFavorite(data);
    }
    onFavoritePress?.();
  };

  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: data.imageUrl }} style={styles.image} />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["transparent", withOpacity(colors.neutral[900], "70")]}
        style={styles.gradientOverlay}
      />

      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        activeOpacity={0.7}
      >
        <Text style={styles.favoriteIcon}>
          {isApartmentFavorite ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>

      {/* Content Overlay */}
      <View style={styles.contentOverlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{data.title}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${data.price}</Text>
            <Text style={styles.priceUnit}>/night</Text>
          </View>

          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>
              {data.location}
              {data.distance && `, ~${data.distance}`}
            </Text>
          </View>

          {/* Property Details */}
          <View style={styles.propertyDetailsContainer}>
            <View style={styles.propertyDetail}>
              <Text style={styles.propertyDetailText}>{data.size}m²</Text>
            </View>
            <View style={styles.propertyDetail}>
              <Text style={styles.propertyDetailText}>
                {data.rooms} <Text style={styles.propertyIcon}>🛏️</Text>
              </Text>
            </View>
            <View style={styles.propertyDetail}>
              <Text style={styles.propertyDetailText}>
                {data.bathrooms} <Text style={styles.propertyIcon}>🛁</Text>
              </Text>
            </View>
          </View>

          {data.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {data.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.neutral[0],
    ...shadows.lg,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: withOpacity(colors.neutral[0], "90"),
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  contentOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  contentContainer: {
    gap: spacing.xs,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[0],
    fontSize: 22,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontSize: 24,
    fontWeight: "700",
  },
  priceUnit: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  locationIcon: {
    fontSize: 14,
  },
  location: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontSize: 14,
    flex: 1,
  },
  propertyDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  propertyDetail: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: withOpacity(colors.neutral[0], "20"),
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  propertyDetailText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontSize: 12,
    fontWeight: "500",
  },
  propertyIcon: {
    fontSize: 16,
  },
  ratingContainer: {
    marginTop: spacing.xs,
  },
  rating: {
    ...textStyles.caption,
    color: colors.neutral[200],
    fontSize: 14,
  },
});
