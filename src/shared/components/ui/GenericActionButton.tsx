import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { Vibration } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
} from "../../../shared/constants/tokens";

export interface GenericActionButtonProps {
  // Content
  label: string;
  icon?: string;

  // Actions
  onPress: () => void;

  // Variants
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";

  // States
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;

  // Behavior
  hapticFeedback?: boolean;
  fullWidth?: boolean;

  // Styling
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
}

export default function GenericActionButton({
  label,
  icon,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  active = false,
  hapticFeedback = false,
  fullWidth = false,
  style,
  textStyle,
  iconStyle,
}: GenericActionButtonProps) {
  const getVariantStyle = () => {
    const baseStyle = {
      borderWidth: 1,
      borderRadius: borderRadius.lg,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: active ? colors.primary[600] : colors.primary[500],
          borderColor: colors.primary[500],
          textColor: colors.neutral[0],
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: active ? colors.primary[50] : "transparent",
          borderColor: colors.primary[500],
          textColor: colors.primary[600],
        };
      case "success":
        return {
          ...baseStyle,
          backgroundColor: active ? colors.success[600] : colors.success[500],
          borderColor: colors.success[500],
          textColor: colors.neutral[0],
        };
      case "warning":
        return {
          ...baseStyle,
          backgroundColor: active ? colors.warning[600] : colors.warning[500],
          borderColor: colors.warning[500],
          textColor: colors.neutral[0],
        };
      case "error":
        return {
          ...baseStyle,
          backgroundColor: active ? colors.error[600] : colors.error[500],
          borderColor: colors.error[500],
          textColor: colors.neutral[0],
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderColor: "transparent",
          textColor: colors.neutral[600],
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.primary[500],
          borderColor: colors.primary[500],
          textColor: colors.neutral[0],
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return {
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          minHeight: 32,
        };
      case "md":
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 40,
        };
      case "lg":
        return {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          minHeight: 48,
        };
      case "xl":
        return {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 40,
        };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  const handlePress = () => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      Vibration.vibrate(50);
    }

    onPress();
  };

  const buttonStyle = [
    variantStyle,
    sizeStyle,
    {
      opacity: disabled ? 0.6 : 1,
    },
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyleCombined = [
    textStyles.button,
    {
      color: variantStyle.textColor,
      fontSize:
        size === "sm" ? 14 : size === "lg" ? 16 : size === "xl" ? 18 : 15,
      fontWeight: size === "sm" ? ("500" as const) : ("600" as const),
    },
    textStyle,
  ];

  const iconStyleCombined = [
    styles.icon,
    {
      fontSize:
        size === "sm" ? 16 : size === "lg" ? 20 : size === "xl" ? 24 : 18,
      marginRight: icon ? spacing.xs : 0,
    },
    iconStyle,
  ];

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          color={variantStyle.textColor}
          size={size === "sm" ? "small" : "small"}
        />
      ) : (
        <>
          {icon && <Text style={iconStyleCombined}>{icon}</Text>}
          <Text style={textStyleCombined}>{label}</Text>
        </>
      )}
    </>
  );

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
  icon: {
    textAlign: "center",
  },
});
