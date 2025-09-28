import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../constants/tokens";

export interface ApartmentCardProps {
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  onPress?: () => void;
  onBookPress?: () => void;
  onFavoritePress?: () => void;
  showBookButton?: boolean;
  showFavoriteButton?: boolean;
  id?: string;
  imageUrl?: string;
  amenities?: string[];
}

export default function ApartmentCard({
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  size,
  onPress,
}: ApartmentCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>🏠</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {location}
        </Text>
        <Text style={styles.price}>₪{price}/month</Text>

        <View style={styles.details}>
          <Text style={styles.detail}>🛏️ {bedrooms}</Text>
          <Text style={styles.detail}>🚿 {bathrooms}</Text>
          <Text style={styles.detail}>📐 {size}m²</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginBottom: spacing.md,
  },
  imageContainer: {
    height: 150,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    fontSize: 32,
    color: colors.neutral[400],
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  location: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[600],
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  details: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  detail: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
});
