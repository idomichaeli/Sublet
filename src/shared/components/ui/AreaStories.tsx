import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TelAvivLocation } from "../../constants/locations";
import { SwipeCardData } from "../../../features/swipe/components/SwipeCard";
import { colors, spacing } from "../../constants/tokens";
import AreaStoriesHeader from "../../../features/favorites/components/AreaStoriesHeader";
import AreaStoryCard, {
  AreaStory,
} from "../../../features/favorites/components/AreaStoryCard";
import { getAreaStories } from "../../../features/favorites/utils/areaUtils";

const STORY_HEIGHT = 140;

interface AreaStoriesProps {
  favorites: SwipeCardData[];
  onAreaPress?: (area: TelAvivLocation) => void;
  selectedArea?: TelAvivLocation | null;
}

export default function AreaStories({
  favorites,
  onAreaPress,
  selectedArea,
}: AreaStoriesProps) {
  const areaStories = getAreaStories(favorites);

  if (areaStories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AreaStoriesHeader areaCount={areaStories.length} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
        style={styles.storiesScroll}
      >
        {areaStories.map((areaStory: AreaStory) => (
          <AreaStoryCard
            key={areaStory.location.id}
            areaStory={areaStory}
            onAreaPress={onAreaPress}
            isSelected={selectedArea?.id === areaStory.location.id}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[0],
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  storiesContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  storiesScroll: {
    maxHeight: STORY_HEIGHT + 20,
  },
});
