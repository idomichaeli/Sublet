import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../../shared/constants/tokens";

interface RequestButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function RequestButton({
  onPress,
  disabled = false,
}: RequestButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>
        Make Request
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: colors.neutral[300],
  },
  buttonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  disabledText: {
    color: colors.neutral[500],
  },
});
