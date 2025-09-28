import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";
import { PropertyObject } from "../../../core/types/propertyObjects/PropertyObject";
import {
  getPropertyAddress,
  getPropertyPrice,
  getPropertyRooms,
  getPropertySize,
  getPropertyDisplayName,
} from "../../../core/types/propertyObjects/PropertyObject";

export interface PropertyObjectCardProps {
  property: PropertyObject;
  status?: "available" | "booked" | "draft";
  views?: number;
  interests?: number;
  rating?: number;
  nextBooking?: string;
  onPress?: () => void;
  onEditPress?: () => void;
  onViewRentersPress?: () => void;
  onDeletePress?: () => void;
  style?: any;
}

export default function PropertyObjectCard({
  property,
  status = "available",
  views = 0,
  interests = 0,
  rating = 0,
  nextBooking,
  onPress,
  onEditPress,
  onViewRentersPress,
  onDeletePress,
  style,
}: PropertyObjectCardProps) {
  const getStatusVariant = () => {
    switch (status) {
      case "available":
        return "available";
      case "booked":
        return "unavailable";
      case "draft":
        return "pending";
      default:
        return "pending";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "available":
        return "Available";
      case "booked":
        return "Booked";
      case "draft":
        return "Draft";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return colors.success[500];
      case "booked":
        return colors.warning[500];
      case "draft":
        return colors.neutral[500];
      default:
        return colors.neutral[500];
    }
  };

  const getStatusBackgroundColor = () => {
    switch (status) {
      case "available":
        return colors.success[50];
      case "booked":
        return colors.warning[50];
      case "draft":
        return colors.neutral[100];
      default:
        return colors.neutral[100];
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {property.photos && property.photos.length > 0 ? (
            <Image source={{ uri: property.photos[0] }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>🏠</Text>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackgroundColor() },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusLabel()}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {getPropertyDisplayName(property)}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {getPropertyAddress(property)}
            </Text>
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{getPropertyPrice(property)}</Text>
              <Text style={styles.priceUnit}>/{property.pricingFrequency}</Text>
            </View>
            {rating > 0 && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.rating}>{rating}</Text>
              </View>
            )}
          </View>

          <View style={styles.propertyDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🛏️</Text>
              <Text style={styles.detailText}>
                {getPropertyRooms(property)} bed
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🚿</Text>
              <Text style={styles.detailText}>
                {property.customBathrooms || property.bathrooms} bath
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📐</Text>
              <Text style={styles.detailText}>{getPropertySize(property)}</Text>
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👁️</Text>
              <Text style={styles.statText}>{views}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statText}>{interests}</Text>
            </View>
            {nextBooking && (
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📅</Text>
                <Text style={styles.statText} numberOfLines={1}>
                  {nextBooking}
                </Text>
              </View>
            )}
          </View>

          {(onEditPress || onViewRentersPress || onDeletePress) && (
            <View style={styles.actions}>
              {onEditPress && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={onEditPress}
                >
                  <Text style={styles.actionIcon}>✏️</Text>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
              )}

              {onViewRentersPress && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.rentersButton]}
                  onPress={onViewRentersPress}
                >
                  <Text style={styles.actionIcon}>👥</Text>
                  <Text style={styles.actionText}>Renters</Text>
                </TouchableOpacity>
              )}

              {onDeletePress && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={onDeletePress}
                >
                  <Text style={styles.actionIcon}>🗑️</Text>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.neutral[200],
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  placeholderText: {
    ...textStyles.caption,
    color: colors.neutral[400],
  },
  statusBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: withOpacity(colors.neutral[0], "20"),
  },
  statusText: {
    ...textStyles.caption,
    fontWeight: "600",
    fontSize: 12,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  location: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontSize: 14,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "700",
  },
  priceUnit: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  ratingIcon: {
    fontSize: 14,
  },
  rating: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "600",
  },
  propertyDetails: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.md,
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.neutral[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "500",
    fontSize: 12,
  },
  stats: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    gap: spacing.md,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  rentersButton: {
    backgroundColor: colors.secondary[50],
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  deleteButton: {
    backgroundColor: colors.error[50],
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    ...textStyles.caption,
    fontWeight: "500",
    fontSize: 12,
  },
});
