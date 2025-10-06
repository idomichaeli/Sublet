import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Vibration } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  liquidGlass,
  withOpacity,
} from "../../constants/tokens";

export interface LiquidGlassButtonProps {
  // Content
  label: string;
  icon?: string;

  // Actions
  onPress: () => void;

  // Variants
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  glassIntensity?: "light" | "medium" | "strong";

  // States
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;

  // Behavior
  hapticFeedback?: boolean;
  fullWidth?: boolean;
  showGradient?: boolean;

  // Styling
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
}

export default function LiquidGlassButton({
  label,
  icon,
  onPress,
  variant = "primary",
  size = "md",
  glassIntensity = "medium",
  disabled = false,
  loading = false,
  active = false,
  hapticFeedback = false,
  fullWidth = false,
  showGradient = true,
  style,
  textStyle,
  iconStyle,
}: LiquidGlassButtonProps) {
  const getVariantColors = () => {
    switch (variant) {
      case "primary":
        return {
          gradient: [colors.primary[500], colors.primary[600]] as const,
          text: colors.neutral[0],
          glass: withOpacity(colors.primary[500], "20"),
        };
      case "secondary":
        return {
          gradient: [
            withOpacity(colors.primary[500], "10"),
            withOpacity(colors.primary[600], "20"),
          ] as const,
          text: colors.primary[600],
          glass: withOpacity(colors.primary[500], "15"),
        };
      case "success":
        return {
          gradient: [colors.success[500], colors.success[600]] as const,
          text: colors.neutral[0],
          glass: withOpacity(colors.success[500], "20"),
        };
      case "warning":
        return {
          gradient: [colors.warning[500], colors.warning[600]] as const,
          text: colors.neutral[0],
          glass: withOpacity(colors.warning[500], "20"),
        };
      case "error":
        return {
          gradient: [colors.error[500], colors.error[600]] as const,
          text: colors.neutral[0],
          glass: withOpacity(colors.error[500], "20"),
        };
      case "ghost":
        return {
          gradient: [
            withOpacity(colors.neutral[0], "10"),
            withOpacity(colors.neutral[0], "20"),
          ] as const,
          text: colors.neutral[600],
          glass: withOpacity(colors.neutral[0], "15"),
        };
      default:
        return {
          gradient: [colors.primary[500], colors.primary[600]] as const,
          text: colors.neutral[0],
          glass: withOpacity(colors.primary[500], "20"),
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 36,
          borderRadius: liquidGlass.radius.md,
        };
      case "md":
        return {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          minHeight: 44,
          borderRadius: liquidGlass.radius.lg,
        };
      case "lg":
        return {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          minHeight: 52,
          borderRadius: liquidGlass.radius.xl,
        };
      case "xl":
        return {
          paddingHorizontal: spacing["2xl"],
          paddingVertical: spacing.xl,
          minHeight: 60,
          borderRadius: liquidGlass.radius["2xl"],
        };
      default:
        return {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          minHeight: 44,
          borderRadius: liquidGlass.radius.lg,
        };
    }
  };

  const getGlassIntensity = () => {
    switch (glassIntensity) {
      case "light":
        return 10;
      case "strong":
        return 30;
      default:
        return 20;
    }
  };

  const variantColors = getVariantColors();
  const sizeStyle = getSizeStyle();
  const blurIntensity = getGlassIntensity();

  const handlePress = () => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      Vibration.vibrate(50);
    }

    onPress();
  };

  const buttonContent = (
    <View
      style={[
        styles.container,
        sizeStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {/* Gradient Background */}
      {showGradient && (
        <LinearGradient
          colors={variantColors.gradient}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      {/* Blur Overlay */}
      <BlurView
        intensity={blurIntensity}
        tint="light"
        style={[
          styles.blurContainer,
          {
            backgroundColor: variantColors.glass,
            borderColor: withOpacity(variantColors.text, "20"),
          },
        ]}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator
              color={variantColors.text}
              size={size === "sm" ? "small" : "small"}
            />
          ) : (
            <>
              {icon && (
                <Text
                  style={[
                    styles.icon,
                    {
                      color: variantColors.text,
                      fontSize:
                        size === "sm"
                          ? 16
                          : size === "lg"
                          ? 20
                          : size === "xl"
                          ? 24
                          : 18,
                      marginRight: icon ? spacing.xs : 0,
                    },
                    iconStyle,
                  ]}
                >
                  {icon}
                </Text>
              )}
              <Text
                style={[
                  textStyles.button,
                  {
                    color: variantColors.text,
                    fontSize:
                      size === "sm"
                        ? 14
                        : size === "lg"
                        ? 16
                        : size === "xl"
                        ? 18
                        : 15,
                    fontWeight: size === "sm" ? "500" : "600",
                  },
                  textStyle,
                ]}
              >
                {label}
              </Text>
            </>
          )}
        </View>
      </BlurView>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={styles.touchableContainer}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  touchableContainer: {
    borderRadius: liquidGlass.radius.lg,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurContainer: {
    borderRadius: liquidGlass.radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  icon: {
    textAlign: "center",
  },
});
