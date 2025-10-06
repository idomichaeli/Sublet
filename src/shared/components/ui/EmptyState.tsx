import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../constants/tokens";

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  buttonText,
  onButtonPress,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary[50], colors.primary[100]]}
        style={styles.iconContainer}
      >
        <Text style={styles.icon}>{icon}</Text>
      </LinearGradient>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {(buttonText && onButtonPress) || (actionLabel && onActionPress) ? (
        <View style={styles.buttonContainer}>
          {buttonText && onButtonPress && (
            <TouchableOpacity style={styles.button} onPress={onButtonPress}>
              <LinearGradient
                colors={[colors.primary[500], colors.primary[600]]}
                style={styles.buttonGradient}
              >
                <Ionicons
                  name="add-circle"
                  size={20}
                  color={colors.neutral[0]}
                />
                <Text style={styles.buttonText}>{buttonText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {actionLabel && onActionPress && (
            <TouchableOpacity style={styles.button} onPress={onActionPress}>
              <LinearGradient
                colors={[colors.primary[500], colors.primary[600]]}
                style={styles.buttonGradient}
              >
                <Ionicons
                  name="add-circle"
                  size={20}
                  color={colors.neutral[0]}
                />
                <Text style={styles.buttonText}>{actionLabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.md,
    textAlign: "center",
    fontWeight: "700",
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xl,
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 280,
  },
  button: {
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  buttonText: {
    ...textStyles.button,
    color: colors.neutral[0],
    fontWeight: "600",
  },
});
