import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";

interface MessageBubbleProps {
  message: string;
  isOwner: boolean;
  timestamp: string;
  isLast?: boolean;
  isNew?: boolean;
}

export default function MessageBubble({
  message,
  isOwner,
  timestamp,
  isLast = false,
  isNew = false,
}: MessageBubbleProps) {
  const scaleAnim = useRef(new Animated.Value(isNew ? 0.3 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isNew, scaleAnim, opacityAnim]);

  return (
    <View
      style={[
        styles.container,
        isOwner ? styles.ownerContainer : styles.renterContainer,
      ]}
    >
      <Animated.View
        style={[
          styles.bubble,
          isOwner ? styles.ownerBubble : styles.renterBubble,
          isLast &&
            (isOwner ? styles.ownerLastBubble : styles.renterLastBubble),
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isOwner ? styles.ownerText : styles.renterText,
          ]}
        >
          {message}
        </Text>
        <Text
          style={[
            styles.timestamp,
            isOwner ? styles.ownerTimestamp : styles.renterTimestamp,
          ]}
        >
          {timestamp}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  ownerContainer: {
    alignItems: "flex-end",
  },
  renterContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  ownerBubble: {
    backgroundColor: colors.neutral[200],
    borderBottomRightRadius: borderRadius.sm,
  },
  renterBubble: {
    backgroundColor: colors.primary[500],
    borderBottomLeftRadius: borderRadius.sm,
  },
  ownerLastBubble: {
    borderBottomRightRadius: borderRadius.sm,
  },
  renterLastBubble: {
    borderBottomLeftRadius: borderRadius.sm,
  },
  messageText: {
    ...textStyles.body,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  ownerText: {
    color: colors.neutral[800],
  },
  renterText: {
    color: colors.neutral[0],
  },
  timestamp: {
    ...textStyles.caption,
    fontSize: 11,
    alignSelf: "flex-end",
  },
  ownerTimestamp: {
    color: colors.neutral[500],
  },
  renterTimestamp: {
    color: withOpacity(colors.neutral[0], "70"),
  },
});
