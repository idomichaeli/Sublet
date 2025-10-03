import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
} from "../../constants/tokens";

export interface DualRangeSliderProps {
  minValue: number;
  maxValue: number;
  onRangeChange: (min: number, max: number) => void;
  minimumRange: number;
  maximumRange: number;
  step?: number;
  unit?: string;
  label?: string;
  disabled?: boolean;
  style?: any;
}

export default function DualRangeSlider({
  minValue,
  maxValue,
  onRangeChange,
  minimumRange = 30,
  maximumRange = 500,
  step = 10,
  unit = "m²",
  label,
  disabled = false,
  style,
}: DualRangeSliderProps) {
  const formatValue = (val: number): string => {
    if (unit === "m²") {
      return `${val}${unit}`;
    }
    if (unit === "$" || unit === "₪") {
      return `${unit}${val}`;
    }
    return `${val}${unit}`;
  };

  const handleMinChange = (value: number) => {
    if (disabled) return;
    const stepValue = Math.round(value / step) * step;
    const clampedValue = Math.max(
      minimumRange,
      Math.min(maxValue - step, stepValue)
    );
    onRangeChange(clampedValue, maxValue);
  };

  const handleMaxChange = (value: number) => {
    if (disabled) return;
    const stepValue = Math.round(value / step) * step;
    const clampedValue = Math.max(
      minValue + step,
      Math.min(maximumRange, stepValue)
    );
    onRangeChange(minValue, clampedValue);
  };

  const decrementMin = () => {
    const newValue = Math.max(minimumRange, minValue - step);
    if (newValue !== minValue) {
      onRangeChange(newValue, maxValue);
    }
  };

  const incrementMin = () => {
    const newValue = Math.min(maxValue - step, minValue + step);
    if (newValue !== minValue) {
      onRangeChange(newValue, maxValue);
    }
  };

  const decrementMax = () => {
    const newValue = Math.max(minValue + step, maxValue - step);
    if (newValue !== maxValue) {
      onRangeChange(minValue, newValue);
    }
  };

  const incrementMax = () => {
    const newValue = Math.min(maximumRange, maxValue + step);
    if (newValue !== maxValue) {
      onRangeChange(minValue, newValue);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Min Value Controls */}
      <View style={styles.sliderSection}>
        <Text style={styles.sectionLabel}>Minimum Size</Text>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, disabled && styles.disabled]}
            onPress={decrementMin}
            disabled={disabled}
          >
            <Text style={styles.controlText}>−</Text>
          </TouchableOpacity>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={minimumRange}
              maximumValue={maximumRange}
              value={minValue}
              onValueChange={handleMinChange}
              step={step}
              disabled={disabled}
              minimumTrackTintColor={colors.primary[500]}
              maximumTrackTintColor={colors.neutral[200]}
            />
          </View>

          <TouchableOpacity
            style={[styles.controlButton, disabled && styles.disabled]}
            onPress={incrementMin}
          >
            <Text style={styles.controlText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.valueText}>{formatValue(minValue)}</Text>
      </View>

      {/* Max Value Controls */}
      <View style={styles.sliderSection}>
        <Text style={styles.sectionLabel}>Maximum Size</Text>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, disabled && styles.disabled]}
            onPress={decrementMax}
            disabled={disabled}
          >
            <Text style={styles.controlText}>−</Text>
          </TouchableOpacity>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={minimumRange}
              maximumValue={maximumRange}
              value={maxValue}
              onValueChange={handleMaxChange}
              step={step}
              disabled={disabled}
              minimumTrackTintColor={colors.primary[500]}
              maximumTrackTintColor={colors.neutral[200]}
            />
          </View>

          <TouchableOpacity
            style={[styles.controlButton, disabled && styles.disabled]}
            onPress={incrementMax}
            disabled={disabled}
          >
            <Text style={styles.controlText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.valueText}>{formatValue(maxValue)}</Text>
      </View>

      {/* Range Display */}
      <View style={styles.rangeDisplay}>
        <Text style={styles.rangeLabel}>Current Range:</Text>
        <Text style={styles.rangeText}>
          {formatValue(minValue)} - {formatValue(maxValue)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: spacing.md,
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  sliderSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  disabled: {
    opacity: 0.5,
  },
  controlText: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "600",
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  slider: {
    height: 40,
  },
  thumb: {
    backgroundColor: colors.primary[500],
    width: 20,
    height: 20,
  },
  valueText: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "600",
    textAlign: "center",
  },
  rangeDisplay: {
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  rangeLabel: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  rangeText: {
    ...textStyles.h3,
    color: colors.neutral[800],
    fontWeight: "600",
  },
});
