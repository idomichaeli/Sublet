import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";

interface ChatListItemProps {
  propertyImage: string;
  propertyTitle: string;
  location: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  onPress: () => void;
}

export default function ChatListItem({
  propertyImage,
  propertyTitle,
  location,
  lastMessage,
  timestamp,
  unreadCount = 0,
  onPress,
}: ChatListItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        {/* Property Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: propertyImage }} style={styles.thumbnail} />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {propertyTitle}
            </Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>

          <View style={styles.subtitle}>
            <Ionicons
              name="location-outline"
              size={12}
              color={colors.neutral[500]}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.neutral[400]}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[0],
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  thumbnailContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[100],
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.primary[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.neutral[0],
  },
  unreadBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontSize: 10,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  title: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.sm,
  },
  timestamp: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontSize: 11,
  },
  subtitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  locationText: {
    ...textStyles.caption,
    color: colors.neutral[500],
    marginLeft: spacing.xs,
    fontSize: 12,
  },
  lastMessage: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 13,
    lineHeight: 16,
  },
  arrowContainer: {
    padding: spacing.xs,
  },
});
