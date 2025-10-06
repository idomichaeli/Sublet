import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../../shared/constants/tokens";
import { useRequestStore } from "../../../core/services/rentalRequestStore";

interface RequestButtonProps {
  onPress: () => void;
  propertyId: string;
}

export default function RequestButton({
  onPress,
  propertyId,
}: RequestButtonProps) {
  const { getRequestsByProperty } = useRequestStore();
  const requests = getRequestsByProperty(propertyId);
  const hasRequest = requests.length > 0;
  const isPending = requests.some((req) => req.status === "pending");

  const getButtonText = () => {
    if (isPending) return "Request Sent";
    if (hasRequest) return "View Request";
    return "Send Offer";
  };

  const getButtonStyle = () => {
    if (isPending) return styles.pendingButton;
    if (hasRequest) return styles.sentButton;
    return styles.button;
  };

  const getTextStyle = () => {
    if (isPending) return styles.pendingText;
    if (hasRequest) return styles.sentText;
    return styles.buttonText;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isPending}
    >
      <Text style={getTextStyle()}>{getButtonText()}</Text>
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
  pendingButton: {
    backgroundColor: colors.neutral[300],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  sentButton: {
    backgroundColor: colors.success[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  buttonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  pendingText: {
    ...textStyles.body,
    color: colors.neutral[500],
    fontWeight: "600",
  },
  sentText: {
    ...textStyles.body,
    color: colors.success[700],
    fontWeight: "600",
  },
});
