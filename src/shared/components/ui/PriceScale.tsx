import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Slider from "@react-native-community/slider";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../constants/tokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PriceScaleProps {
  ownerPrice: number;
  onPriceChange: (price: number) => void;
  initialPrice?: number;
}

export default function PriceScale({
  ownerPrice,
  onPriceChange,
  initialPrice,
}: PriceScaleProps) {
  const [currentPrice, setCurrentPrice] = useState(initialPrice || ownerPrice);

  // Calculate price range (±20% from owner price)
  const minPrice = Math.round(ownerPrice * 0.8);
  const maxPrice = Math.round(ownerPrice * 1.2);

  const handlePriceChange = (value: number) => {
    const roundedPrice = Math.round(value);
    setCurrentPrice(roundedPrice);
    onPriceChange(roundedPrice);
  };

  const getPriceLabel = (price: number) => {
    if (price === ownerPrice) return "Owner Price";
    if (price < ownerPrice)
      return `${Math.round(((price - ownerPrice) / ownerPrice) * 100)}%`;
    return `+${Math.round(((price - ownerPrice) / ownerPrice) * 100)}%`;
  };

  const getPriceColor = (price: number) => {
    if (price === ownerPrice) return colors.neutral[600];
    if (price < ownerPrice) return colors.success[600];
    return colors.warning[600];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Offer Price</Text>

      {/* Price Scale */}
      <View style={styles.scaleContainer}>
        {/* Price Labels */}
        <View style={styles.priceLabels}>
          <Text style={[styles.priceLabel, { color: getPriceColor(minPrice) }]}>
            ${minPrice}
          </Text>
          <Text style={[styles.priceLabel, { color: colors.neutral[600] }]}>
            ${ownerPrice}
          </Text>
          <Text style={[styles.priceLabel, { color: getPriceColor(maxPrice) }]}>
            ${maxPrice}
          </Text>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minPrice}
            maximumValue={maxPrice}
            value={currentPrice}
            onValueChange={handlePriceChange}
            step={1}
            minimumTrackTintColor={colors.primary[500]}
            maximumTrackTintColor={colors.neutral[200]}
            thumbTintColor={colors.primary[500]}
          />
        </View>
      </View>

      {/* Current Price Display */}
      <View style={styles.priceDisplay}>
        <Text style={styles.currentPriceLabel}>Your Offer:</Text>
        <Text
          style={[styles.currentPrice, { color: getPriceColor(currentPrice) }]}
        >
          ${currentPrice}
        </Text>
        <Text
          style={[styles.priceChange, { color: getPriceColor(currentPrice) }]}
        >
          {getPriceLabel(currentPrice)}
        </Text>
      </View>
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
    textAlign: "center",
  },
  scaleContainer: {
    marginBottom: spacing.md,
  },
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  priceLabel: {
    ...textStyles.caption,
    fontSize: 12,
    fontWeight: "500",
  },
  sliderContainer: {
    paddingHorizontal: spacing.sm,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  currentPriceLabel: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  currentPrice: {
    ...textStyles.h3,
    fontWeight: "700",
  },
  priceChange: {
    ...textStyles.caption,
    fontWeight: "600",
  },
});
