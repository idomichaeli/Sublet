import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, spacing, borderRadius, textStyles } from "../../../shared/constants/tokens";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export default function Chip({
  label,
  selected = false,
  onPress,
  variant = "default",
  size = "md",
  disabled = false,
  style,
  textStyle,
  icon,
}: ChipProps) {
  const getVariantStyle = () => {
    if (selected) {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: colors.primary[500],
            borderColor: colors.primary[500],
            textColor: colors.neutral[0],
          };
        case "secondary":
          return {
            backgroundColor: colors.secondary[500],
            borderColor: colors.secondary[500],
            textColor: colors.neutral[0],
          };
        default:
          return {
            backgroundColor: colors.primary[100],
            borderColor: colors.primary[500],
            textColor: colors.primary[700],
          };
      }
    } else {
      return {
        backgroundColor: colors.neutral[0],
        borderColor: colors.neutral[300],
        textColor: colors.neutral[700],
      };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = sizeStyles[size];

  const chipStyle = [
    styles.base,
    sizeStyle,
    {
      backgroundColor: variantStyle.backgroundColor,
      borderColor: variantStyle.borderColor,
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];

  const textStyleCombined = [
    textStyles.caption,
    {
      color: variantStyle.textColor,
      fontWeight: selected ? ("600" as const) : ("500" as const),
    },
    textStyle,
  ];

  const content = (
    <>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={textStyleCombined}>{label}</Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={chipStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <Text style={chipStyle}>{content}</Text>;
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 28,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
  lg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
});
