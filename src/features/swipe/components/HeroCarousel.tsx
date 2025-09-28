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
} from "../../../shared/constants/tokens";

export interface HeroItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface HeroCarouselProps {
  data: HeroItem[];
  onHeroPress?: (heroId: string) => void;
}

export default function HeroCarousel({ data, onHeroPress }: HeroCarouselProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((hero) => (
          <TouchableOpacity
            key={hero.id}
            style={styles.heroCard}
            onPress={() => onHeroPress?.(hero.id)}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{hero.title}</Text>
              <Text style={styles.heroSubtitle}>{hero.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  heroCard: {
    width: 280,
    height: 120,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    justifyContent: "center",
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
  },
  heroTitle: {
    ...textStyles.h3,
    color: colors.neutral[0],
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  heroSubtitle: {
    ...textStyles.body,
    color: colors.neutral[0],
    opacity: 0.9,
  },
});
