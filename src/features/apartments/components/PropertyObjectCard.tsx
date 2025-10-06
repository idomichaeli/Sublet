import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
  withOpacity,
  liquidGlass,
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
            <LinearGradient
              colors={[colors.neutral[100], colors.neutral[200]]}
              style={styles.imagePlaceholder}
            >
              <Ionicons name="home" size={48} color={colors.neutral[400]} />
              <Text style={styles.placeholderText}>No Image</Text>
            </LinearGradient>
          )}

          {/* Enhanced Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackgroundColor() },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusLabel()}
            </Text>
          </View>

          {/* Property Type Badge */}
          <View style={styles.typeBadge}>
            <Ionicons
              name={property.propertyCategory === "house" ? "home" : "business"}
              size={12}
              color={colors.neutral[600]}
            />
            <Text style={styles.typeText}>
              {property.propertyCategory === "house" ? "House" : "Apartment"}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {getPropertyDisplayName(property)}
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color={colors.neutral[500]} />
              <Text style={styles.location} numberOfLines={1}>
                {getPropertyAddress(property)}
              </Text>
            </View>
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{getPropertyPrice(property)}</Text>
              <Text style={styles.priceUnit}>/{property.pricingFrequency}</Text>
            </View>
            {rating > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color={colors.warning[500]} />
                <Text style={styles.rating}>{rating}</Text>
              </View>
            )}
          </View>

          <View style={styles.propertyDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="bed" size={14} color={colors.neutral[600]} />
              <Text style={styles.detailText}>
                {getPropertyRooms(property)} bed
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={14} color={colors.neutral[600]} />
              <Text style={styles.detailText}>
                {property.customBathrooms || property.bathrooms} bath
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="resize" size={14} color={colors.neutral[600]} />
              <Text style={styles.detailText}>{getPropertySize(property)}</Text>
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={16} color={colors.neutral[500]} />
              <Text style={styles.statText}>{views}</Text>
              <Text style={styles.statLabel}>views</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color={colors.error[500]} />
              <Text style={styles.statText}>{interests}</Text>
              <Text style={styles.statLabel}>interests</Text>
            </View>
            {nextBooking && (
              <View style={styles.statItem}>
                <Ionicons
                  name="calendar"
                  size={16}
                  color={colors.warning[500]}
                />
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
                  <Ionicons
                    name="create"
                    size={16}
                    color={colors.primary[600]}
                  />
                  <Text
                    style={[styles.actionText, { color: colors.primary[600] }]}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              )}

              {onViewRentersPress && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.rentersButton]}
                  onPress={onViewRentersPress}
                >
                  <Ionicons
                    name="people"
                    size={16}
                    color={colors.secondary[600]}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: colors.secondary[600] },
                    ]}
                  >
                    Renters
                  </Text>
                </TouchableOpacity>
              )}

              {onDeletePress && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={onDeletePress}
                >
                  <Ionicons name="trash" size={16} color={colors.error[600]} />
                  <Text
                    style={[styles.actionText, { color: colors.error[600] }]}
                  >
                    Delete
                  </Text>
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
    backgroundColor: liquidGlass.glass.light.background,
    borderRadius: liquidGlass.radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
    ...shadows.md,
    shadowColor: liquidGlass.glass.light.shadow,
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
    marginTop: spacing.xs,
  },
  statusBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: liquidGlass.radius.md,
    borderWidth: 1,
    borderColor: liquidGlass.glass.medium.border,
    backgroundColor: liquidGlass.glass.medium.background,
    ...shadows.sm,
    shadowColor: liquidGlass.glass.medium.shadow,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  statusText: {
    ...textStyles.caption,
    fontWeight: "600",
    fontSize: 12,
  },
  typeBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: liquidGlass.glass.strong.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: liquidGlass.radius.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: liquidGlass.glass.strong.border,
    ...shadows.sm,
    shadowColor: liquidGlass.glass.strong.shadow,
  },
  typeText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "500",
    fontSize: 11,
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  location: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontSize: 14,
    flex: 1,
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
    backgroundColor: liquidGlass.glass.light.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: liquidGlass.radius.md,
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "600",
    fontSize: 12,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontWeight: "400",
    fontSize: 10,
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
    borderRadius: liquidGlass.radius.lg,
    gap: spacing.xs,
  },
  editButton: {
    backgroundColor: liquidGlass.glass.light.background,
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
    ...shadows.sm,
    shadowColor: liquidGlass.glass.light.shadow,
  },
  rentersButton: {
    backgroundColor: liquidGlass.glass.light.background,
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
    ...shadows.sm,
    shadowColor: liquidGlass.glass.light.shadow,
  },
  deleteButton: {
    backgroundColor: liquidGlass.glass.light.background,
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
    ...shadows.sm,
    shadowColor: liquidGlass.glass.light.shadow,
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
