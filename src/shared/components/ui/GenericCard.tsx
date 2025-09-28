import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";
import Card from "./Card";
import Tag from "./Tag";
import Button from "./Button";

export interface GenericCardProps {
  // Core content
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;

  // Status and metadata
  status?: "available" | "unavailable" | "pending" | "draft" | "booked";
  statusLabel?: string;
  price?: number;
  priceUnit?: string;
  rating?: number;
  reviewCount?: number;

  // Stats (flexible key-value pairs)
  stats?: Array<{
    label: string;
    value: string | number;
    icon?: string;
  }>;

  // Actions
  onPress?: () => void;
  onActionPress?: () => void;
  onSecondaryActionPress?: () => void;
  actionLabel?: string;
  secondaryActionLabel?: string;

  // Display options
  showStatus?: boolean;
  showPrice?: boolean;
  showRating?: boolean;
  showStats?: boolean;
  showActions?: boolean;
  showGradient?: boolean;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;

  // Layout
  variant?: "default" | "compact" | "detailed";
  imageHeight?: number;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function GenericCard({
  id,
  title,
  subtitle,
  description,
  imageUrl,
  status,
  statusLabel,
  price,
  priceUnit = "/night",
  rating,
  reviewCount,
  stats = [],
  onPress,
  onActionPress,
  onSecondaryActionPress,
  actionLabel,
  secondaryActionLabel,
  showStatus = true,
  showPrice = true,
  showRating = true,
  showStats = true,
  showActions = false,
  showGradient = false,
  showFavorite = false,
  isFavorite = false,
  onFavoritePress,
  variant = "default",
  imageHeight = 200,
  style,
  contentStyle,
}: GenericCardProps) {
  const getStatusVariant = () => {
    switch (status) {
      case "available":
        return "available";
      case "unavailable":
      case "booked":
        return "unavailable";
      case "pending":
      case "draft":
        return "pending";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    if (statusLabel) return statusLabel;
    switch (status) {
      case "available":
        return "Available";
      case "unavailable":
        return "Unavailable";
      case "booked":
        return "Booked";
      case "pending":
        return "Pending";
      case "draft":
        return "Draft";
      default:
        return "";
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

  const renderImage = () => {
    if (!imageUrl) return null;

    return (
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {showGradient && (
          <LinearGradient
            colors={["transparent", withOpacity(colors.neutral[900], "70")]}
            style={styles.gradientOverlay}
          />
        )}

        {showStatus && status && (
          <View style={styles.statusBadge}>
            <Tag
              label={getStatusText()}
              variant={getStatusVariant()}
              size="sm"
            />
          </View>
        )}

        {showFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
            activeOpacity={0.7}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderContent = () => (
    <View style={[styles.content, contentStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={styles.title}
          numberOfLines={variant === "compact" ? 1 : 2}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Description */}
      {description && variant === "detailed" && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* Price and Rating */}
      <View style={styles.metaInfo}>
        {showPrice && price && (
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${price}</Text>
            <Text style={styles.priceUnit}>{priceUnit}</Text>
          </View>
        )}

        {showRating && rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{renderStars(rating)}</Text>
            {reviewCount && (
              <Text style={styles.reviewCount}>({reviewCount})</Text>
            )}
          </View>
        )}
      </View>

      {/* Stats */}
      {showStats && stats.length > 0 && (
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              {stat.icon && <Text style={styles.statIcon}>{stat.icon}</Text>}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      {showActions && (actionLabel || secondaryActionLabel) && (
        <View style={styles.actionsContainer}>
          {actionLabel && onActionPress && (
            <Button
              title={actionLabel}
              onPress={onActionPress}
              variant="primary"
              size="sm"
              style={styles.actionButton}
            />
          )}
          {secondaryActionLabel && onSecondaryActionPress && (
            <Button
              title={secondaryActionLabel}
              onPress={onSecondaryActionPress}
              variant="secondary"
              size="sm"
              style={styles.actionButton}
            />
          )}
        </View>
      )}
    </View>
  );

  const cardContent = (
    <>
      {renderImage()}
      {renderContent()}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return <Card style={[styles.container, style] as any}>{cardContent}</Card>;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
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
  statusBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: withOpacity(colors.neutral[0], "80"),
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteIcon: {
    fontSize: 20,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  description: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    ...textStyles.h3,
    fontWeight: "700",
    color: colors.primary[600],
  },
  priceUnit: {
    ...textStyles.caption,
    color: colors.neutral[500],
    marginLeft: spacing.xs,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  reviewCount: {
    ...textStyles.caption,
    color: colors.neutral[500],
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
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
    ...textStyles.body,
    fontWeight: "600",
    color: colors.neutral[800],
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
