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
  location: typeof TelAvivLocation;
  count: number;
  apartments: SwipeCardData[];
}

interface AreaStoryCardProps {
  areaStory: AreaStory;
  onAreaPress?: (area: typeof TelAvivLocation) => void;
  isSelected?: boolean;
}

export default function AreaStoryCard({
  areaStory,
  onAreaPress,
  isSelected = false,
}: AreaStoryCardProps) {
  const { location, count } = areaStory;

  // Get representative images for each area
  const getAreaImage = (location: any): string => {
    const areaImages: { [key: string]: string } = {
      "Neve Avivim":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Azorei Hen":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Kokhav HaTzafon":
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "Ramat Aviv Aleph":
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "Ramat Aviv Gimmel":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Ramat Aviv HaHadasha":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Ne'ot Afeka":
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "Ma'oz Aviv":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Hadar Yosef":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      Tzahala:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      Revivim:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "Tel Baruch":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "HaTzafon HaYashan (Old North)":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Lev HaIr":
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      Montefiori:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "Yehuda HaMaccabi":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      Bavli:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Tzamarot Ayalon":
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "Giv'at Amal Bet":
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "Kerem HaTeimanim":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Neve Tzedek":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      Shabazi:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      Florentin:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "Neve Sha'anan":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Neve Ofer":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Kiryat Shalom":
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      Shapira:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      HaTikva:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Giv'at Herzl":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Abu Kabir":
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "American–German Colony":
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "Nahalat Yitzhak":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      Bitzaron:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Ramat Yisrael":
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "Tel Haim":
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "Ramat HaTayasim":
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Neve Tzahal":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Kfar Shalem":
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      HaArgazim:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      Ezra: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Yad Eliyahu":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "Old Jaffa":
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      Ajami:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      Menashiya:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      "Giv'at Aliyah":
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      Tzahalon:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    };

    return (
      areaImages[location.name] ||
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
