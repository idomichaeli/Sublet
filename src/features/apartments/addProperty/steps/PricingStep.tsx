import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../../shared/constants/tokens";
import Card from "../../../../shared/components/ui/Card";
import Slider from "../../../../shared/components/ui/Slider";
import { StepProps } from "../types/PropertyData";

export default function PricingStep({ data, onUpdate }: StepProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [localPrice, setLocalPrice] = useState(data.price);

  // Update local state when data changes
  useEffect(() => {
    setLocalPrice(data.price);
  }, [data.price]);

  // Calculate derived prices (weekly and nightly from monthly)
  const calculateDerivedPrices = () => {
    const monthlyPrice = localPrice;
    const weeklyPrice = Math.round((monthlyPrice * 7) / 30);
    const nightlyPrice = Math.round(monthlyPrice / 30);

    return {
      monthly: monthlyPrice,
      weekly: weeklyPrice,
      nightly: nightlyPrice,
    };
  };

  const derivedPrices = calculateDerivedPrices();

  // Handle price change
  const handlePriceChange = (price: number) => {
    setLocalPrice(price);
    onUpdate({ price });
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.title, isDark && styles.darkTitle]}>
        Set Your Price
      </Text>
      <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>
        Set your monthly rental price for this property.
      </Text>

      <Card style={styles.inputCard}>
        {/* Price Input */}
        <Slider
          label="Monthly Rent"
          value={localPrice}
          onValueChange={handlePriceChange}
          minimumValue={500}
          maximumValue={8000}
          step={50}
          unit="$"
          style={styles.priceSlider}
        />

        {/* Auto-calculated Price Cards */}
        <View style={styles.priceCards}>
          <View style={[styles.priceCard, isDark && styles.darkPriceCard]}>
            <Text
              style={[
                styles.priceCardLabel,
                isDark && styles.darkPriceCardLabel,
              ]}
            >
              Weekly (auto)
            </Text>
            <Text style={styles.priceCardValue}>${derivedPrices.weekly}</Text>
          </View>

          <View style={[styles.priceCard, isDark && styles.darkPriceCard]}>
            <Text
              style={[
                styles.priceCardLabel,
                isDark && styles.darkPriceCardLabel,
              ]}
            >
              Nightly (auto)
            </Text>
            <Text style={styles.priceCardValue}>${derivedPrices.nightly}</Text>
          </View>
        </View>

        {/* Helper Text */}
        <Text style={[styles.helperText, isDark && styles.darkHelperText]}>
          These conversions are for display only. Renters will see consistent
          pricing.
        </Text>
      </Card>

      {/* Pricing Tips */}
      <View style={[styles.pricingInfo, isDark && styles.darkPricingInfo]}>
        <Text
          style={[
            styles.pricingInfoTitle,
            isDark && styles.darkPricingInfoTitle,
          ]}
        >
          💰 Pricing Tips:
        </Text>
        <Text
          style={[styles.pricingInfoText, isDark && styles.darkPricingInfoText]}
        >
          • Research similar properties in your area
        </Text>
        <Text
          style={[styles.pricingInfoText, isDark && styles.darkPricingInfoText]}
        >
          • Consider seasonal demand
        </Text>
        <Text
          style={[styles.pricingInfoText, isDark && styles.darkPricingInfoText]}
        >
          • Include utilities if applicable
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: colors.dark.background,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  darkTitle: {
    color: colors.dark.onBackground,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  darkSubtitle: {
    color: colors.dark.onSurfaceVariant,
  },
  inputCard: {
    marginBottom: spacing.lg,
  },
  priceSlider: {
    marginBottom: spacing.lg,
  },
  priceCards: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  priceCard: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: "center",
    ...shadows.sm,
  },
  darkPriceCard: {
    backgroundColor: colors.dark.surfaceVariant,
    borderColor: colors.dark.surfaceVariant,
  },
  priceCardLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  darkPriceCardLabel: {
    color: colors.dark.onSurfaceVariant,
  },
  priceCardValue: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "600",
  },
  helperText: {
    ...textStyles.caption,
    color: colors.neutral[500],
    textAlign: "center",
    marginBottom: spacing.lg,
    fontStyle: "italic",
  },
  darkHelperText: {
    color: colors.dark.onSurfaceVariant,
  },
  pricingInfo: {
    backgroundColor: colors.warning[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  darkPricingInfo: {
    backgroundColor: colors.warning[900],
    borderColor: colors.warning[800],
  },
  pricingInfoTitle: {
    ...textStyles.body,
    color: colors.warning[700],
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  darkPricingInfoTitle: {
    color: colors.warning[300],
  },
  pricingInfoText: {
    ...textStyles.caption,
    color: colors.warning[600],
    marginBottom: spacing.xs,
  },
  darkPricingInfoText: {
    color: colors.warning[400],
  },
});
