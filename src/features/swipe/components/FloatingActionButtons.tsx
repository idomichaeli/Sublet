import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration,
} from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

interface FloatingActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onUndo?: () => void;
  onFilterPress?: () => void;
  canUndo?: boolean;
  disabled?: boolean;
  hasActiveFilters?: boolean;
}

export default function FloatingActionButtons({
  onSwipeLeft,
  onSwipeRight,
  onUndo,
  onFilterPress,
  canUndo = false,
  disabled = false,
  hasActiveFilters = false,
}: FloatingActionButtonsProps) {
  const handleSwipeLeft = () => {
    if (disabled) return;
    Vibration.vibrate(50);
    onSwipeLeft();
  };

  const handleSwipeRight = () => {
    if (disabled) return;
    Vibration.vibrate(50);
    onSwipeRight();
  };

  const handleUndo = () => {
    if (disabled || !canUndo) return;
    Vibration.vibrate(30);
    onUndo?.();
  };

  return (
    <View style={styles.container}>
      {/* Undo Button */}
      {canUndo && (
        <TouchableOpacity
          style={[styles.undoButton, disabled && styles.disabledButton]}
          onPress={handleUndo}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.undoIcon}>↶</Text>
        </TouchableOpacity>
      )}

      {/* Filter Button */}
      {onFilterPress && (
        <TouchableOpacity
          style={[
            styles.filterButton,
            hasActiveFilters && styles.filterButtonActive,
            disabled && styles.disabledButton,
          ]}
          onPress={onFilterPress}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          {hasActiveFilters && <View style={styles.filterIndicator} />}
        </TouchableOpacity>
      )}

      {/* Main Action Buttons */}
      <View style={styles.mainButtons}>
        {/* Pass Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.passButton,
            disabled && styles.disabledButton,
          ]}
          onPress={handleSwipeLeft}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.passIcon}>✕</Text>
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.likeButton,
            disabled && styles.disabledButton,
          ]}
          onPress={handleSwipeRight}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.likeIcon}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 120, // Account for tab bar height (80px) + margin (16px) + extra spacing (24px)
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  mainButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
  },
  passButton: {
    backgroundColor: colors.error[500],
  },
  likeButton: {
    backgroundColor: colors.success[500],
  },
  undoButton: {
    position: "absolute",
    left: spacing.lg,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.neutral[400],
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  filterButton: {
    position: "absolute",
    right: spacing.lg,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  filterButtonActive: {
    backgroundColor: colors.primary[600],
  },
  filterIcon: {
    fontSize: 20,
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
  passIcon: {
    fontSize: 24,
    color: colors.neutral[0],
    fontWeight: "bold",
  },
  likeIcon: {
    fontSize: 24,
    color: colors.neutral[0],
    fontWeight: "bold",
  },
  undoIcon: {
    fontSize: 20,
    color: colors.neutral[0],
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
