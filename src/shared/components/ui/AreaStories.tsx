import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../constants/tokens";

interface AreaStory {
  id: string;
  title: string;
  image: string;
  apartments: number;
}

interface AreaStoriesProps {
  stories: AreaStory[];
  onStoryPress?: (storyId: string) => void;
}

export default function AreaStories({
  stories,
  onStoryPress,
}: AreaStoriesProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Area Stories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyCard}
            onPress={() => onStoryPress?.(story.id)}
          >
            <View style={styles.imageContainer}>
              <Text style={styles.imagePlaceholder}>🏘️</Text>
            </View>
            <Text style={styles.storyTitle} numberOfLines={1}>
              {story.title}
            </Text>
            <Text style={styles.apartmentCount}>
              {story.apartments} apartments
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  storyCard: {
    width: 120,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
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
  storyTitle: {
    ...textStyles.caption,
    color: colors.neutral[900],
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  apartmentCount: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 10,
  },
});
