import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { TelAvivLocation } from "../../../shared/constants/locations";
import { SwipeCardData } from "../../swipe/components/SwipeCard";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";

const STORY_WIDTH = 120;
const STORY_HEIGHT = 140;
const STORY_MARGIN = spacing.sm;

export interface AreaStory {
  location: TelAvivLocation;
  count: number;
  apartments: SwipeCardData[];
}

interface AreaStoryCardProps {
  areaStory: AreaStory;
  onAreaPress?: (area: TelAvivLocation) => void;
  isSelected?: boolean;
}

export default function AreaStoryCard({
  areaStory,
  onAreaPress,
  isSelected = false,
}: AreaStoryCardProps) {
  const { location, count } = areaStory;

  // Get representative images for each area
  const getAreaImage = (location: TelAvivLocation): string => {
    const areaImages: { [key: string]: string } = {
      city_center:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      lev_hair:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      kerem_hateimanim:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      florentin:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      neve_tzedek:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      jaffa:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      allenby_carmel:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      sarona_hakirya:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      hayarkon_namal:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      bavli:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      montefiore:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      shapira:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      neve_shaanan:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      kikar_hamedina:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      old_north:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      new_north:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      ramat_aviv:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      kiryat_shalom:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      yad_eliyahu:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      ramat_hahayal:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      hatikva_quarter:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    };

    return (
      areaImages[location.id] ||
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
    );
  };

  const areaImage = getAreaImage(location);

  return (
    <TouchableOpacity
      style={[
        styles.storyContainer,
        isSelected && styles.selectedStoryContainer,
      ]}
      onPress={() => onAreaPress?.(location)}
      activeOpacity={0.8}
    >
      <View style={[styles.storyCard, isSelected && styles.selectedStoryCard]}>
        <Image source={{ uri: areaImage }} style={styles.storyImage} />
        <View style={styles.storyOverlay}>
          <View style={styles.storyContent}>
            <Text style={styles.storyTitle} numberOfLines={2}>
              {location.name}
            </Text>
            {count > 1 && (
              <View
                style={[
                  styles.countBadge,
                  isSelected && styles.selectedCountBadge,
                ]}
              >
                <Text style={styles.countText}>{count}</Text>
              </View>
            )}
          </View>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedIcon}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  storyContainer: {
    marginRight: STORY_MARGIN,
    width: STORY_WIDTH,
  },
  storyCard: {
    width: STORY_WIDTH,
    height: STORY_HEIGHT,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    position: "relative",
    ...shadows.md,
  },
  storyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  storyOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: withOpacity(colors.neutral[900], "40"),
    padding: spacing.sm,
    justifyContent: "flex-end",
  },
  storyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  storyTitle: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
    fontSize: 12,
    flex: 1,
    textShadowColor: withOpacity(colors.neutral[900], "50"),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  countBadge: {
    backgroundColor: colors.primary[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.xs,
    borderWidth: 1,
    borderColor: colors.neutral[0],
  },
  countText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "700",
    fontSize: 10,
  },
  selectedStoryContainer: {
    transform: [{ scale: 1.05 }],
  },
  selectedStoryCard: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  selectedCountBadge: {
    backgroundColor: colors.primary[600],
  },
  selectedIndicator: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.neutral[0],
  },
  selectedIcon: {
    color: colors.neutral[0],
    fontSize: 12,
    fontWeight: "700",
  },
});
