import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  textStyles,
  liquidGlass,
  withOpacity,
} from "../../constants/tokens";

export interface LiquidGlassSectionProps {
  // Content
  title?: string;
  subtitle?: string;
  children: React.ReactNode;

  // Header actions
  actionLabel?: string;
  onActionPress?: () => void;

  // Layout
  variant?: "light" | "medium" | "strong";
  showDivider?: boolean;
  showGradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];

  // Styling
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  glassIntensity?: number;
}

export default function LiquidGlassSection({
  title,
  subtitle,
  children,
  actionLabel,
  onActionPress,
  variant = "medium",
  showDivider = false,
  showGradient = false,
  gradientColors = [
    withOpacity(colors.primary[500], "10"),
    withOpacity(colors.primary[600], "20"),
  ] as const,
  style,
  headerStyle,
  contentStyle,
  titleStyle,
  subtitleStyle,
  glassIntensity = 20,
}: LiquidGlassSectionProps) {
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

  const glassStyle = getGlassStyle();

  const renderHeader = () => {
    if (!title && !subtitle && !actionLabel) return null;

    return (
      <View style={[styles.header, headerStyle]}>
        <View style={styles.headerContent}>
          {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {subtitle && (
            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
          )}
        </View>

        {actionLabel && onActionPress && (
          <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
            <Text style={styles.actionLabel}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderDivider = () => {
    if (!showDivider) return null;

    return (
      <View style={styles.dividerContainer}>
        <LinearGradient
          colors={[
            withOpacity(colors.neutral[0], "0"),
            withOpacity(colors.neutral[0], "30"),
            withOpacity(colors.neutral[0], "0"),
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.divider}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Gradient Background */}
      {showGradient && (
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      {/* Blur Container */}
      <BlurView
        intensity={glassIntensity}
        tint="light"
        style={[
          styles.blurContainer,
          {
            backgroundColor: glassStyle.background,
            borderColor: glassStyle.border,
          },
        ]}
      >
        {renderHeader()}
        {renderDivider()}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: liquidGlass.radius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
  gradientBackground: {
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
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  actionLabel: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  dividerContainer: {
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    borderRadius: 0.5,
  },
  content: {
    width: "100%",
  },
});
