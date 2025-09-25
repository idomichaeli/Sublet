import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, borderRadius, shadows } from "../../../shared/constants/tokens";

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  shadow?: keyof typeof shadows;
  backgroundColor?: string;
}

export default function Card({
  children,
  style,
  padding = "md",
  shadow = "md",
  backgroundColor = colors.neutral[0],
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        {
          padding: spacing[padding],
          backgroundColor,
        },
        shadows[shadow],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
});
