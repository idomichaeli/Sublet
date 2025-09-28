import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../../shared/constants/tokens";

interface AreaStoryCardProps {
  area: {
    id: string;
    name: string;
    city: string;
    apartments: number;
  };
  onPress?: () => void;
}

export default function AreaStoryCard({ area, onPress }: AreaStoryCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>🏘️</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {area.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {area.city}
        </Text>
        <Text style={styles.count}>{area.apartments} apartments</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    marginRight: spacing.sm,
  },
  imageContainer: {
    height: 80,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  imagePlaceholder: {
    fontSize: 24,
    color: colors.neutral[400],
  },
  content: {
    flex: 1,
  },
  title: {
    ...textStyles.caption,
    color: colors.neutral[900],
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  count: {
    ...textStyles.caption,
    color: colors.primary[600],
    fontSize: 10,
    fontWeight: "500",
  },
});
