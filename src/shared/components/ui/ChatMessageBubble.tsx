import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../constants/tokens";

export interface MessageBubbleProps {
  message: string;
  isOwner: boolean;
  timestamp: string;
  isLast?: boolean;
  isNew?: boolean;
  imageUrl?: string;
  isTyping?: boolean;
  style?: any;
}

export default function MessageBubble({
  message,
  isOwner,
  timestamp,
  isLast = false,
  isNew = false,
  imageUrl,
  isTyping = false,
  style,
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
        style,
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
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.messageImage} />
        )}

        {isTyping ? (
          <View style={styles.typingContainer}>
            <Text
              style={[
                styles.typingText,
                isOwner ? styles.ownerText : styles.renterText,
              ]}
            >
              typing...
            </Text>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        ) : (
          <Text
            style={[
              styles.messageText,
              isOwner ? styles.ownerText : styles.renterText,
            ]}
          >
            {message}
          </Text>
        )}
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
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingText: {
    ...textStyles.body,
    fontStyle: "italic",
    marginRight: spacing.xs,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  dot1: {
    backgroundColor: colors.neutral[400],
  },
  dot2: {
    backgroundColor: colors.neutral[500],
  },
  dot3: {
    backgroundColor: colors.neutral[600],
  },
});
