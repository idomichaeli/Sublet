import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  statusColors,
} from "../../../shared/constants/tokens";

export interface TagProps {
  label: string;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "approved"
    | "pending"
    | "rejected"
    | "available"
    | "unavailable";
  size?: "sm" | "md";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Tag({
  label,
  variant = "default",
  size = "md",
  style,
  textStyle,
}: TagProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "success":
      case "approved":
      case "available":
        return {
          backgroundColor: colors.success[50],
          borderColor: colors.success[500],
          textColor: colors.success[700],
        };
      case "warning":
      case "pending":
        return {
          backgroundColor: colors.warning[50],
          borderColor: colors.warning[500],
          textColor: colors.warning[700],
        };
      case "error":
      case "rejected":
        return {
          backgroundColor: colors.error[50],
          borderColor: colors.error[500],
          textColor: colors.error[700],
        };
      case "unavailable":
        return {
          backgroundColor: colors.neutral[100],
          borderColor: colors.neutral[400],
          textColor: colors.neutral[600],
        };
      default:
        return {
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[500],
          textColor: colors.primary[700],
        };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = sizeStyles[size];

  return (
    <View
      style={[
        styles.base,
        sizeStyle,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
        },
        style,
      ]}
    >
      <Text
        style={[
          textStyles.caption,
          {
            color: variantStyle.textColor,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
