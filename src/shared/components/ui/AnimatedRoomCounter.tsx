import React, { useEffect } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
} from "../../constants/tokens";

export interface AnimatedRoomCounterProps {
  count: number;
  style?: ViewStyle;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function AnimatedRoomCounter({
  count,
  style,
  size = "md",
  showLabel = true,
}: AnimatedRoomCounterProps) {
  const animatedCount = useSharedValue(count);
  const scaleValue = useSharedValue(1);
  const pulseValue = useSharedValue(0);

  useEffect(() => {
    // Animate count change
    animatedCount.value = withSpring(count, {
      damping: 12,
      stiffness: 200,
    });

    // Trigger more dramatic animation sequence when count changes
    scaleValue.value = withSequence(
      withTiming(1.5, { duration: 200 }),
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );

    // More dramatic pulse animation for extra emphasis
    pulseValue.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 300 })
    );
  }, [count, animatedCount, scaleValue, pulseValue]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const scale = interpolate(scaleValue.value, [0, 1], [1, 1.5]);
    const opacity = interpolate(pulseValue.value, [0, 1], [1, 0.6]);
    const color = interpolateColor(
      pulseValue.value,
      [0, 1],
      [colors.primary[600], colors.primary[800]]
    );

    return {
      transform: [{ scale }],
      opacity,
      color,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(scaleValue.value, [0, 1], [1, 1.3]);
    const backgroundColor = interpolateColor(
      pulseValue.value,
      [0, 1],
      [colors.primary[50], colors.primary[100]]
    );
    const borderColor = interpolateColor(
      pulseValue.value,
      [0, 1],
      [colors.primary[200], colors.primary[400]]
    );

    return {
      transform: [{ scale }],
      backgroundColor,
      borderColor,
    };
  });

  const sizeStyles = {
    sm: {
      containerPadding: spacing.sm,
      fontSize: textStyles.caption.fontSize,
      borderRadius: borderRadius.sm,
    },
    md: {
      containerPadding: spacing.md,
      fontSize: textStyles.body.fontSize,
      borderRadius: borderRadius.md,
    },
    lg: {
      containerPadding: spacing.lg,
      fontSize: textStyles.h3.fontSize,
      borderRadius: borderRadius.lg,
    },
  };

  const currentSizeStyle = sizeStyles[size];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          padding: currentSizeStyle.containerPadding,
          borderRadius: currentSizeStyle.borderRadius,
        },
        animatedContainerStyle,
        style,
      ]}
    >
      <Animated.Text
        style={[
          styles.countText,
          {
            fontSize: currentSizeStyle.fontSize,
          },
          animatedTextStyle,
        ]}
      >
        {count}
      </Animated.Text>
      {showLabel && (
        <Text
          style={[
            styles.labelText,
            { fontSize: currentSizeStyle.fontSize * 0.7 },
          ]}
        >
          Rooms
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[50],
    borderWidth: 2,
    borderColor: colors.primary[200],
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    minHeight: 40,
  },
  countText: {
    ...textStyles.h3,
    color: colors.primary[600],
    fontWeight: "bold",
    textAlign: "center",
  },
  labelText: {
    ...textStyles.caption,
    color: colors.primary[500],
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },
});
