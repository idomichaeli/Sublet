import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  liquidGlass,
  withOpacity,
} from "../../constants/tokens";

export interface LiquidGlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "light" | "medium" | "strong";
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  showBorder?: boolean;
  showShadow?: boolean;
  backgroundImage?: string;
  gradientColors?: readonly [string, string, ...string[]];
  intensity?: number;
}

export default function LiquidGlassCard({
  children,
  onPress,
  variant = "medium",
  style,
  contentStyle,
  showBorder = true,
  showShadow = true,
  backgroundImage,
  gradientColors,
  intensity = 20,
}: LiquidGlassCardProps) {
  const getGlassStyle = () => {
    switch (variant) {
      case "light":
        return liquidGlass.glass.light;
      case "strong":
        return liquidGlass.glass.strong;
      default:
        return liquidGlass.glass.medium;
    }
  };

  const glassStyle = getGlassStyle();

  const cardContent = (
    <View style={[styles.container, style]}>
      {/* Background Image */}
      {backgroundImage && (
        <Image
          source={{ uri: backgroundImage }}
          style={styles.backgroundImage}
          blurRadius={intensity}
        />
      )}

      {/* Gradient Overlay */}
      {gradientColors && (
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      {/* Blur View */}
      <BlurView
        intensity={intensity}
        tint="light"
        style={[
          styles.blurContainer,
          {
            backgroundColor: glassStyle.background,
            borderColor: showBorder ? glassStyle.border : "transparent",
          },
          showShadow && {
            shadowColor: glassStyle.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
            elevation: 8,
          },
        ]}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </BlurView>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.touchableContainer}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: liquidGlass.radius.lg,
    overflow: "hidden",
  },
  touchableContainer: {
    borderRadius: liquidGlass.radius.lg,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  blurContainer: {
    borderRadius: liquidGlass.radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    padding: spacing.lg,
  },
});
