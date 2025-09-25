import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import { colors, spacing, borderRadius, textStyles } from "../../../shared/constants/tokens";

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
  size?: "sm" | "md" | "lg";
}

export default function Toggle({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
  size = "md",
}: ToggleProps) {
  const animatedValue = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    animatedValue.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value, animatedValue]);

  const toggleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [colors.neutral[300], colors.primary[500]]
    );

    return {
      backgroundColor,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const translateX =
      animatedValue.value *
      (sizeStyles[size].width - sizeStyles[size].thumbSize - 4);

    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.toggleContainer,
          sizeStyles[size],
          { opacity: disabled ? 0.6 : 1 },
        ]}
      >
        <Animated.View style={[styles.toggle, toggleStyle, sizeStyles[size]]}>
          <Animated.View
            style={[
              styles.thumb,
              thumbStyle,
              {
                width: sizeStyles[size].thumbSize,
                height: sizeStyles[size].thumbSize,
                borderRadius: sizeStyles[size].thumbSize / 2,
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  toggleContainer: {
    justifyContent: "center",
  },
  toggle: {
    borderRadius: borderRadius.full,
    justifyContent: "center",
    padding: 2,
  },
  thumb: {
    backgroundColor: colors.neutral[0],
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});

const sizeStyles = {
  sm: {
    width: 40,
    height: 24,
    thumbSize: 20,
  },
  md: {
    width: 52,
    height: 32,
    thumbSize: 28,
  },
  lg: {
    width: 64,
    height: 40,
    thumbSize: 36,
  },
} as const;
