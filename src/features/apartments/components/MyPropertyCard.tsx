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
import { OwnerProperty } from "../../../core/types/ownerPropertyList";

export interface MyPropertyCardProps {
  property: OwnerProperty;
  onPress?: () => void;
  onEditPress?: () => void;
  onViewRentersPress?: () => void;
  onDeletePress?: () => void;
  style?: any;
}

export default function MyPropertyCard({
  property,
  onPress,
  onEditPress,
  onViewRentersPress,
  onDeletePress,
  style,
}: MyPropertyCardProps) {
  const getStatusColor = () => {
    switch (property.status) {
      case "published":
        return colors.success[500];
      case "draft":
        return colors.warning[500];
      case "archived":
        return colors.neutral[500];
      default:
        return colors.neutral[500];
    }
  };

  const getStatusBackgroundColor = () => {
    switch (property.status) {
      case "published":
        return colors.success[50];
      case "draft":
        return colors.warning[50];
      case "archived":
        return colors.neutral[100];
      default:
        return colors.neutral[100];
    }
  };

  const getStatusLabel = () => {
    switch (property.status) {
      case "published":
        return "LIVE";
      case "draft":
        return "DRAFT";
      case "archived":
        return "ARCHIVED";
      default:
        return "UNKNOWN";
    }
  };

  const formatPrice = (price: number, frequency: string) => {
    return `₪${price.toLocaleString()}/${frequency}`;
  };

  const getPropertyTitle = () => {
    const category =
      property.propertyCategory === "house" ? "House" : "Apartment";
    const area = property.area?.name || "Tel Aviv";
    return `${category} • ${area}`;
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
              <Text style={styles.placeholderIcon}>
                {property.propertyCategory === "house" ? "🏠" : "🏢"}
              </Text>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}

          {/* Status Badge */}
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

          {/* New Property Badge */}
          {property.status === "published" && property.publishedAt && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {getPropertyTitle()}
            </Text>
            <Text style={styles.address} numberOfLines={1}>
              {property.street} {property.streetNumber}
            </Text>
          </View>

          {/* Property Details */}
          <View style={styles.propertyDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🛏️</Text>
              <Text style={styles.detailText}>
                {property.customBedrooms || property.bedrooms} bed
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
              <Text style={styles.detailText}>{property.size}m²</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {formatPrice(property.price, property.pricingFrequency)}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👁️</Text>
              <Text style={styles.statValue}>{property.views || 0}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💬</Text>
              <Text style={styles.statValue}>{property.inquiries || 0}</Text>
              <Text style={styles.statLabel}>Inquiries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statValue}>{property.bookings || 0}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
          </View>

          {/* Actions */}
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

              {onViewRentersPress && property.status === "published" && (
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
    height: 180,
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
    fontSize: 40,
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
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  newBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  newBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 0.5,
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
  address: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontSize: 14,
  },
  propertyDetails: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.sm,
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
    fontSize: 12,
  },
  detailText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "500",
    fontSize: 12,
  },
  priceContainer: {
    marginBottom: spacing.md,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "700",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...textStyles.h4,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 11,
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
    fontSize: 14,
  },
  actionText: {
    ...textStyles.caption,
    fontWeight: "500",
    fontSize: 12,
  },
});
