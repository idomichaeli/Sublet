import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";

export interface GenericSectionProps {
  // Content
  title?: string;
  subtitle?: string;
  children: React.ReactNode;

  // Header actions
  actionLabel?: string;
  onActionPress?: () => void;

  // Layout
  variant?: "default" | "compact" | "spacious";
  showDivider?: boolean;

  // Styling
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export default function GenericSection({
  title,
  subtitle,
  children,
  actionLabel,
  onActionPress,
  variant = "default",
  showDivider = false,
  style,
  headerStyle,
  contentStyle,
  titleStyle,
  subtitleStyle,
}: GenericSectionProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "compact":
        return {
          marginBottom: spacing.md,
          paddingHorizontal: spacing.md,
        };
      case "spacious":
        return {
          marginBottom: spacing.xl,
          paddingHorizontal: spacing.lg,
        };
      default:
        return {
          marginBottom: spacing.lg,
          paddingHorizontal: spacing.lg,
        };
    }
  };

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
          <Text style={styles.actionLabel} onPress={onActionPress}>
            {actionLabel}
          </Text>
        )}
      </View>
    );
  };

  const renderDivider = () => {
    if (!showDivider) return null;

    return <View style={styles.divider} />;
  };

  const variantStyle = getVariantStyle();

  return (
    <View style={[styles.container, variantStyle, style]}>
      {renderHeader()}
      {renderDivider()}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginBottom: spacing.md,
  },
  content: {
    width: "100%",
  },
});
