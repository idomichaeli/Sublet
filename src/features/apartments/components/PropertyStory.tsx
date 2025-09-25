import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
} from "../../../shared/constants/tokens";

export interface PropertyStoryProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  location: string;
  isActive?: boolean;
  onPress?: () => void;
}

export default function PropertyStory({
  id,
  title,
  imageUrl,
  price,
  location,
  isActive = false,
  onPress,
}: PropertyStoryProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price}</Text>
          <Text style={styles.priceUnit}>/night</Text>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    marginRight: spacing.sm,
  },
  activeContainer: {
    borderWidth: 2,
    borderColor: colors.primary[500],
    borderRadius: borderRadius.lg,
  },
  imageContainer: {
    height: 120,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  priceContainer: {
    position: "absolute",
    bottom: spacing.xs,
    left: spacing.xs,
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  priceUnit: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontSize: 10,
    marginLeft: 2,
  },
  textContainer: {
    paddingHorizontal: spacing.xs,
  },
  title: {
    ...textStyles.caption,
    color: colors.neutral[900],
    fontWeight: "500",
    marginBottom: 2,
  },
  location: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 11,
  },
});
