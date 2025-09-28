import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

interface TinderActionsProps {
  onReject: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRewind: () => void;
  canRewind: boolean;
}

export default function TinderActions({
  onReject,
  onLike,
  onSuperLike,
  onRewind,
  canRewind,
}: TinderActionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        {/* Rewind Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.rewindButton]}
          onPress={onRewind}
          disabled={!canRewind}
        >
          <View
            style={[styles.buttonContent, !canRewind && styles.disabledButton]}
          >
            <Text style={styles.rewindIcon}>↶</Text>
          </View>
        </TouchableOpacity>

        {/* Reject Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onReject}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.rejectIcon}>✕</Text>
          </View>
        </TouchableOpacity>

        {/* Super Like Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={onSuperLike}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.superLikeIcon}>⭐</Text>
          </View>
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={onLike}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.likeIcon}>❤️</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl + spacing.lg, // Extra padding for tab bar
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xl,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  buttonContent: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.3,
  },
  rewindButton: {
    backgroundColor: colors.neutral[200],
  },
  rejectButton: {
    backgroundColor: colors.error[500],
  },
  superLikeButton: {
    backgroundColor: colors.primary[500],
  },
  likeButton: {
    backgroundColor: colors.success[500],
  },
  rewindIcon: {
    fontSize: 24,
    color: colors.neutral[600],
    fontWeight: "bold",
  },
  rejectIcon: {
    fontSize: 24,
    color: colors.neutral[0],
    fontWeight: "bold",
  },
  superLikeIcon: {
    fontSize: 24,
    color: colors.neutral[0],
  },
  likeIcon: {
    fontSize: 24,
    color: colors.neutral[0],
  },
});
