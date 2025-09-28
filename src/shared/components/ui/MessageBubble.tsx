import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../constants/tokens";

export interface MessageBubbleProps {
  message: string;
  isOwn: boolean;
  timestamp?: string;
}

export default function MessageBubble({
  message,
  isOwn,
  timestamp,
}: MessageBubbleProps) {
  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <Text style={[styles.message, isOwn ? styles.ownText : styles.otherText]}>
        {message}
      </Text>
      {timestamp && (
        <Text
          style={[
            styles.timestamp,
            isOwn ? styles.ownTimestamp : styles.otherTimestamp,
          ]}
        >
          {timestamp}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.xs,
  },
  ownMessage: {
    backgroundColor: colors.primary[500],
    alignSelf: "flex-end",
    borderBottomRightRadius: borderRadius.sm,
  },
  otherMessage: {
    backgroundColor: colors.neutral[100],
    alignSelf: "flex-start",
    borderBottomLeftRadius: borderRadius.sm,
  },
  message: {
    ...textStyles.body,
    lineHeight: 20,
  },
  ownText: {
    color: colors.neutral[0],
  },
  otherText: {
    color: colors.neutral[900],
  },
  timestamp: {
    ...textStyles.caption,
    marginTop: spacing.xs,
    fontSize: 10,
  },
  ownTimestamp: {
    color: colors.neutral[0],
    opacity: 0.7,
  },
  otherTimestamp: {
    color: colors.neutral[600],
  },
});
