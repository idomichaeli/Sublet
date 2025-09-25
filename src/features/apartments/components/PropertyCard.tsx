import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
} from "../../../shared/constants/tokens";
import Tag from "../../../shared/components/ui/Tag";

export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  status: "available" | "booked" | "draft";
  views: number;
  interests: number;
  price?: number;
  rating?: number;
  nextBooking?: string;
  onPress?: () => void;
  onEditPress?: () => void;
  onViewRentersPress?: () => void;
  onDeletePress?: () => void;
  style?: any;
}

export default function PropertyCard({
  id,
  title,
  location,
  imageUrl,
  status,
  views,
  interests,
  price,
  rating,
  nextBooking,
  onPress,
  onEditPress,
  onViewRentersPress,
  onDeletePress,
  style,
}: PropertyCardProps) {
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

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.statusBadge}>
          <Tag
            label={getStatusLabel()}
            variant={getStatusVariant()}
            size="sm"
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View style={styles.metaInfo}>
          {price && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${price}</Text>
              <Text style={styles.priceUnit}>/night</Text>
            </View>
          )}
          {rating && rating > 0 && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.rating}>{rating}</Text>
            </View>
          )}
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

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={onEditPress}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rentersButton]}
            onPress={onViewRentersPress}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Renters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDeletePress}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    backgroundColor: colors.neutral[200],
  },
  statusBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
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
  },
  location: {
    ...textStyles.body,
    color: colors.neutral[600],
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
  },
  rentersButton: {
    backgroundColor: colors.secondary[50],
  },
  deleteButton: {
    backgroundColor: colors.error[50],
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    ...textStyles.caption,
    fontWeight: "500",
  },
});
