import React from "react";
import { View, Text, StyleSheet, ViewStyle, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  colors,
  spacing,
  textStyles,
  liquidGlass,
  withOpacity,
} from "../../constants/tokens";

export interface LiquidGlassAvatarProps {
  // Content
  name?: string;
  imageUrl?: string;
  initials?: string;

  // Size variants
  size?: "sm" | "md" | "lg" | "xl" | "2xl";

  // Status
  status?: "online" | "offline" | "away" | "busy";
  showStatus?: boolean;

  // Styling
  variant?: "light" | "medium" | "strong";
  showBorder?: boolean;
  showGradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
}

export default function LiquidGlassAvatar({
  name,
  imageUrl,
  initials,
  size = "md",
  status,
  showStatus = true,
  variant = "medium",
  showBorder = true,
  showGradient = true,
  gradientColors = [
    withOpacity(colors.primary[500], "20"),
    withOpacity(colors.primary[600], "30"),
  ] as const,
  style,
}: LiquidGlassAvatarProps) {
  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
          fontSize: 12,
        };
      case "md":
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
          fontSize: 16,
        };
      case "lg":
        return {
          width: 64,
          height: 64,
          borderRadius: 32,
          fontSize: 20,
        };
      case "xl":
        return {
          width: 80,
          height: 80,
          borderRadius: 40,
          fontSize: 24,
        };
      case "2xl":
        return {
          width: 120,
          height: 120,
          borderRadius: 60,
          fontSize: 32,
        };
      default:
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
          fontSize: 16,
        };
    }
  };

  const getGlassStyle = () => {
    switch (variant) {
      case "light":
        return {
          background: liquidGlass.glass.light.background,
          border: liquidGlass.glass.light.border,
        };
      case "strong":
        return {
          background: liquidGlass.glass.strong.background,
          border: liquidGlass.glass.strong.border,
        };
      default:
        return {
          background: liquidGlass.glass.medium.background,
          border: liquidGlass.glass.medium.border,
        };
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return colors.success[500];
      case "away":
        return colors.warning[500];
      case "busy":
        return colors.error[500];
      default:
        return colors.neutral[400];
    }
  };

  const sizeStyle = getSizeStyle();
  const glassStyle = getGlassStyle();
  const statusColor = getStatusColor();

  const getInitials = () => {
    if (initials) return initials;
    if (name) {
      const names = name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return "U";
  };

  const renderStatusIndicator = () => {
    if (!showStatus || !status) return null;

    const statusSize =
      size === "sm"
        ? 8
        : size === "lg"
        ? 12
        : size === "xl"
        ? 14
        : size === "2xl"
        ? 18
        : 10;

    return (
      <View
        style={[
          styles.statusIndicator,
          {
            width: statusSize,
            height: statusSize,
            borderRadius: statusSize / 2,
            backgroundColor: statusColor,
            borderColor: colors.neutral[0],
            borderWidth: 2,
            bottom:
              size === "sm"
                ? 0
                : size === "lg"
                ? 2
                : size === "xl"
                ? 3
                : size === "2xl"
                ? 4
                : 1,
            right:
              size === "sm"
                ? 0
                : size === "lg"
                ? 2
                : size === "xl"
                ? 3
                : size === "2xl"
                ? 4
                : 1,
          },
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Gradient Background */}
      {showGradient && (
        <LinearGradient
          colors={gradientColors}
          style={[styles.gradientBackground, sizeStyle]}
        />
      )}

      {/* Blur Container */}
      <BlurView
        intensity={20}
        tint="light"
        style={[
          styles.blurContainer,
          sizeStyle,
          {
            backgroundColor: glassStyle.background,
            borderColor: showBorder ? glassStyle.border : "transparent",
            borderWidth: showBorder ? 2 : 0,
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, sizeStyle]}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              styles.initials,
              {
                fontSize: sizeStyle.fontSize,
                color: colors.neutral[700],
              },
            ]}
          >
            {getInitials()}
          </Text>
        )}
      </BlurView>

      {renderStatusIndicator()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.3,
  },
  blurContainer: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    ...textStyles.h3,
    fontWeight: "600",
    textAlign: "center",
  },
  statusIndicator: {
    position: "absolute",
  },
});
