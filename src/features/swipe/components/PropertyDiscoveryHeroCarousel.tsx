import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  withOpacity,
} from "../../../shared/constants/tokens";
import Button from "../../../shared/components/ui/Button";

const { width } = Dimensions.get("window");

export interface HeroItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  cta: string;
}

interface HeroCarouselProps {
  data: HeroItem[];
  onHeroPress: (heroId: string) => void;
}

export default function HeroCarousel({ data, onHeroPress }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderHeroItem = ({ item }: { item: HeroItem }) => (
    <TouchableOpacity
      style={styles.heroItem}
      onPress={() => onHeroPress(item.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.heroImage} />
      <View style={styles.heroOverlay}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
          <Button
            title={item.cta}
            variant="secondary"
            size="sm"
            style={styles.heroButton}
            onPress={() => onHeroPress(item.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.heroContainer}>
      <FlatList
        data={data}
        renderItem={renderHeroItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      {/* Hero Indicators */}
      <View style={styles.heroIndicators}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.heroIndicator,
              index === currentIndex && styles.heroIndicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 180,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  heroItem: {
    width: width,
    height: 180,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpacity(colors.neutral[900], "40"),
    justifyContent: "center",
    alignItems: "center",
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  heroTitle: {
    ...textStyles.h2,
    color: colors.neutral[0],
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...textStyles.body,
    color: colors.neutral[100],
    textAlign: "center",
    marginBottom: spacing.md,
  },
  heroButton: {
    backgroundColor: colors.neutral[0],
    borderColor: colors.neutral[0],
  },
  heroIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
  },
  heroIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral[300],
    marginHorizontal: spacing.xs,
  },
  heroIndicatorActive: {
    backgroundColor: colors.primary[500],
  },
});
