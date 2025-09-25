import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration,
} from "react-native";
import { colors, spacing, borderRadius, shadows } from "../../../shared/constants/tokens";

interface FloatingActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
  disabled?: boolean;
}

export default function FloatingActionButtons({
  onSwipeLeft,
  onSwipeRight,
  onUndo,
  canUndo = false,
  disabled = false,
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
    bottom: spacing["2xl"],
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
