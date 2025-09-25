import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  useColorScheme,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
} from "../../../shared/constants/tokens";

export interface SegmentedControlOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function SegmentedControl({
  options,
  selectedValue,
  onValueChange,
  disabled = false,
  style,
}: SegmentedControlProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const selectedIndex = options.findIndex(
    (option) => option.value === selectedValue
  );
  const animatedValue = useSharedValue(selectedIndex);

  React.useEffect(() => {
    animatedValue.value = withSpring(selectedIndex, {
      damping: 15,
      stiffness: 150,
    });
  }, [selectedIndex, animatedValue]);

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = isDark
      ? colors.dark.surfaceVariant
      : colors.neutral[100];
    return { backgroundColor };
  });

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = animatedValue.value * (100 / options.length);
    const width = 100 / options.length;

    return {
      transform: [{ translateX: `${translateX}%` }],
      width: `${width}%`,
    };
  });

  const handlePress = (value: string) => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.background, backgroundStyle]}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {options.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => handlePress(option.value)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option.value && styles.selectedText,
                disabled && styles.disabledText,
                isDark && styles.darkText,
                selectedValue === option.value &&
                  isDark &&
                  styles.darkSelectedText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  background: {
    flexDirection: "row",
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    padding: 4,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  optionText: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontWeight: "500",
  },
  selectedText: {
    color: colors.neutral[900],
    fontWeight: "600",
  },
  disabledText: {
    color: colors.neutral[400],
  },
  darkText: {
    color: colors.dark.onSurfaceVariant,
  },
  darkSelectedText: {
    color: colors.dark.onSurface,
  },
});
