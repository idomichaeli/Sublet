import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors, spacing, borderRadius, textStyles } from "../../../shared/constants/tokens";

export interface ChatBubbleProps {
  message: string;
  isOwner: boolean;
  timestamp: string;
  imageUrl?: string;
  isTyping?: boolean;
  style?: any;
}

export default function ChatBubble({
  message,
  isOwner,
  timestamp,
  imageUrl,
  isTyping = false,
  style,
}: ChatBubbleProps) {
  const bubbleStyle = isOwner ? styles.ownerBubble : styles.renterBubble;
  const textStyle = isOwner ? styles.ownerText : styles.renterText;
  const containerStyle = isOwner
    ? styles.ownerContainer
    : styles.renterContainer;

  return (
    <View style={[styles.container, containerStyle, style]}>
      <View style={[styles.bubble, bubbleStyle]}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.messageImage} />
        )}

        {isTyping ? (
          <View style={styles.typingContainer}>
            <Text style={[styles.typingText, textStyle]}>typing...</Text>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        ) : (
          <Text style={[styles.messageText, textStyle]}>{message}</Text>
        )}
      </View>

      <Text
        style={[
          styles.timestamp,
          isOwner ? styles.ownerTimestamp : styles.renterTimestamp,
        ]}
      >
        {timestamp}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: "80%",
  },
  ownerContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  renterContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    maxWidth: "100%",
  },
  ownerBubble: {
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: borderRadius.sm,
  },
  renterBubble: {
    backgroundColor: colors.neutral[100],
    borderBottomLeftRadius: borderRadius.sm,
  },
  messageText: {
    ...textStyles.body,
    lineHeight: 20,
  },
  ownerText: {
    color: colors.neutral[0],
  },
  renterText: {
    color: colors.neutral[900],
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
  timestamp: {
    ...textStyles.caption,
    marginTop: spacing.xs,
    fontSize: 11,
  },
  ownerTimestamp: {
    color: colors.neutral[500],
    textAlign: "right",
  },
  renterTimestamp: {
    color: colors.neutral[500],
    textAlign: "left",
  },
});
