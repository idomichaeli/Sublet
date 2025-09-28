import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
} from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
} from "../../../shared/constants/tokens";
import Card from "./Card";
import Tag from "./Tag";
import Button from "./Button";

export interface ApartmentCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  priceUnit?: string;
  imageUrl?: string;
  status?: "available" | "unavailable" | "pending";
  rating?: number;
  reviewCount?: number;
  isFavorite?: boolean;
  amenities?: string[];
  rooms?: number;
  bathrooms?: number;
  size?: number; // in square meters
  onPress?: () => void;
  onBookPress?: () => void;
  onEditPress?: () => void;
  onFavoritePress?: () => void;
  showBookButton?: boolean;
  showEditButton?: boolean;
  showFavoriteButton?: boolean;
  style?: ViewStyle;
}

const { width } = Dimensions.get("window");
const cardWidth = width - spacing.lg * 2;

export default function ApartmentCard({
  id,
  title,
  location,
  price,
  priceUnit = "/night",
  imageUrl,
  status = "available",
  rating,
  reviewCount,
  isFavorite = false,
  amenities = [],
  rooms,
  bathrooms,
  size,
  onPress,
  onBookPress,
  onEditPress,
  onFavoritePress,
  showBookButton = false,
  showEditButton = false,
  showFavoriteButton = false,
  style,
}: ApartmentCardProps) {
  const getStatusTag = () => {
    switch (status) {
      case "available":
        return <Tag label="Available" variant="available" size="sm" />;
      case "unavailable":
        return <Tag label="Unavailable" variant="unavailable" size="sm" />;
      case "pending":
        return <Tag label="Pending" variant="pending" size="sm" />;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    if (hasHalfStar) {
      stars.push("⭐");
    }
    return stars.join("");
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card
        style={StyleSheet.flatten([styles.card, { width: cardWidth }, style])}
        shadow={true}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.statusContainer}>{getStatusTag()}</View>
          {showFavoriteButton && (
            <TouchableOpacity
              style={styles.favoriteContainer}
              onPress={onFavoritePress}
              activeOpacity={0.7}
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.price}>
              ${price}
              <Text style={styles.priceUnit}>{priceUnit}</Text>
            </Text>
          </View>

          <Text style={styles.location} numberOfLines={1}>
            📍 {location}
          </Text>

          {/* Property Details */}
          {(rooms || bathrooms || size) && (
            <View style={styles.propertyDetailsContainer}>
              {size && (
                <View style={styles.propertyDetail}>
                  <Text style={styles.propertyDetailText}>{size}m²</Text>
                </View>
              )}
              {rooms && (
                <View style={styles.propertyDetail}>
                  <Text style={styles.propertyDetailText}>
                    {rooms} <Text style={styles.propertyIcon}>🛏️</Text>
                  </Text>
                </View>
              )}
              {bathrooms && (
                <View style={styles.propertyDetail}>
                  <Text style={styles.propertyDetailText}>
                    {bathrooms} <Text style={styles.propertyIcon}>🛁</Text>
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Rating */}
          {rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStars}>{renderStars(rating)}</Text>
              <Text style={styles.ratingText}>
                {rating.toFixed(1)} ({reviewCount} reviews)
              </Text>
            </View>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              {amenities.slice(0, 3).map((amenity, index) => (
                <Tag
                  key={index}
                  label={amenity}
                  variant="default"
                  size="sm"
                  style={styles.amenityTag}
                />
              ))}
              {amenities.length > 3 && (
                <Text style={styles.moreAmenities}>
                  +{amenities.length - 3} more
                </Text>
              )}
            </View>
          )}

          {/* Action Buttons */}
          {(showBookButton || showEditButton) && (
            <View style={styles.actions}>
              {showBookButton && (
                <Button
                  title="View Details"
                  onPress={onBookPress || (() => {})}
                  variant="primary"
                  size="sm"
                  style={styles.actionButton}
                />
              )}
              {showEditButton && (
                <Button
                  title="Edit"
                  onPress={onEditPress || (() => {})}
                  variant="secondary"
                  size="sm"
                  style={styles.actionButton}
                />
              )}
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 200,
    marginBottom: spacing.sm,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.lg,
  },
  placeholderImage: {
    backgroundColor: colors.neutral[200],
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    ...textStyles.body,
    color: colors.neutral[500],
  },
  statusContainer: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
  },
  favoriteContainer: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    ...shadows.sm,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  title: {
    ...textStyles.h3,
    color: colors.neutral[900],
    flex: 1,
    marginRight: spacing.sm,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "700",
  },
  priceUnit: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "400",
  },
  location: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  propertyDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  propertyDetail: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  propertyDetailText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  propertyIcon: {
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  ratingStars: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  ratingText: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  amenityTag: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  moreAmenities: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
