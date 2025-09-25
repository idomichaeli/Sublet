import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
} from "../../../shared/constants/tokens";

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  unit?: string;
  label?: string;
  disabled?: boolean;
  style?: any;
}

export default function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  unit = "",
  label,
  disabled = false,
  style,
}: SliderProps) {
  const formatValue = (val: number) => {
    if (unit === "m²") {
      return `${val}${unit}`;
    }
    if (unit === "$") {
      return `${unit}${val}`;
    }
    return `${val}${unit}`;
  };

  const handleDecrease = () => {
    const newValue = Math.max(minimumValue, value - step);
    onValueChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(maximumValue, value + step);
    onValueChange(newValue);
  };

  const progress = (value - minimumValue) / (maximumValue - minimumValue);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.sliderContainer}>
        <View style={styles.track}>
          <View style={[styles.trackActive, { width: `${progress * 100}%` }]} />
          <View style={[styles.thumb, { left: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, disabled && styles.disabled]}
          onPress={handleDecrease}
          disabled={disabled || value <= minimumValue}
        >
          <Text style={styles.controlText}>−</Text>
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{formatValue(value)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.controlButton, disabled && styles.disabled]}
          onPress={handleIncrease}
          disabled={disabled || value >= maximumValue}
        >
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rangeContainer}>
        <Text style={styles.rangeText}>{formatValue(minimumValue)}</Text>
        <Text style={styles.rangeText}>{formatValue(maximumValue)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  sliderContainer: {
    height: 40,
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  track: {
    height: 4,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.sm,
    position: "relative",
  },
  trackActive: {
    height: 4,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.sm,
    position: "absolute",
    left: 0,
    top: 0,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary[500],
    borderRadius: 10,
    position: "absolute",
    top: -8,
    marginLeft: -10,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  valueContainer: {
    marginHorizontal: spacing.xl,
    alignItems: "center",
  },
  valueText: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "600",
  },
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  rangeText: {
    ...textStyles.caption,
    color: colors.neutral[500],
  },
});
