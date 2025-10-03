import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";
import LogoIcon from "../../../shared/components/ui/LogoIcon";

type ViewMode = "list" | "swipe";

interface HomeHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  remainingCount?: number;
}

export default function HomeHeader({
  viewMode,
  onViewModeChange,
  onFilterPress,
  hasActiveFilters = false,
  remainingCount,
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {/* Left: Logo and Discover title with gradient */}
        <View style={styles.titleContainer}>
          <View style={styles.logoAndTitle}>
            <LogoIcon size={100} />
            <Svg width="120" height="32" viewBox="0 0 120 32">
              <Defs>
                <LinearGradient
                  id="titleGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#4CAF50" />
                  <Stop offset="100%" stopColor="#FF9800" />
                </LinearGradient>
              </Defs>
              <SvgText
                x="0"
                y="24"
                fontSize="24"
                fontWeight="700"
                fontFamily="System"
                fill="url(#titleGradient)"
              >
                Discover
              </SvgText>
            </Svg>
          </View>
        </View>

        {/* Center: Count */}
        {remainingCount !== undefined && (
          <Text style={styles.countText}>{remainingCount} left</Text>
        )}

        {/* Right: Filter button */}
        {onFilterPress && (
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 7h18M6 12h12M9 17h6"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2, // Increased from spacing.md
    paddingBottom: spacing.md,
    backgroundColor: colors.neutral[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoAndTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.none,
  },
  countText: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontSize: 16,
    fontWeight: "500",
  },
  filterButton: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 40,
    height: 40,
    ...shadows.sm,
  },
  filterIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error[500],
  },
});
