import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { useRequestStore } from "../../../core/services/rentalRequestStore";
import { useChatStore } from "../../../core/services/messagingStore";
import { useAuthStore } from "../../../core/services/authenticationStore";
import { RentalRequest } from "../../../shared/types/request";
import { SwipeCardData } from "../../swipe/components/SwipeCard";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";

interface RequestButtonProps {
  listing: SwipeCardData;
  onPress: () => void;
  style?: any;
}

type ButtonState = "make_request" | "pending" | "chat";

export default function RequestButton({
  listing,
  onPress,
  style,
}: RequestButtonProps) {
  const { user } = useAuthStore();
  const { getRequestByListing, fetchByListing, refreshRequest, requests } =
    useRequestStore();
  const { messagesByPeer, load } = useChatStore();

  const [request, setRequest] = useState<RentalRequest | null>(null);
  const [buttonState, setButtonState] = useState<ButtonState>("make_request");
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadRequestData();
  }, [listing.id]);

  useEffect(() => {
    if (request) {
      updateButtonState();
    }
  }, [request, messagesByPeer]);

  // Watch for changes in the requests store
  useEffect(() => {
    const currentRequest = getRequestByListing(listing.id);
    if (currentRequest && (!request || currentRequest.id !== request.id)) {
      setRequest(currentRequest);
    }
  }, [requests, listing.id, getRequestByListing, request]);

  // Refresh request data when the component becomes visible
  useEffect(() => {
    const refreshData = async () => {
      if (listing.id) {
        await refreshRequest(listing.id);
        await loadRequestData();
      }
    };

    refreshData();
  }, [listing.id]);

  const loadRequestData = async () => {
    // First check if we have the request in our store
    let existingRequest = getRequestByListing(listing.id);

    if (!existingRequest) {
      // If not, try to fetch it from the API
      existingRequest = await fetchByListing(listing.id);
    }

    setRequest(existingRequest);
  };

  const updateButtonState = async () => {
    if (!request) {
      setButtonState("make_request");
      return;
    }

    switch (request.status) {
      case "pending":
        setButtonState("pending");
        break;
      case "approved":
        setButtonState("chat");
        // Load chat messages using request id
        try {
          await load(request.id);
        } catch (error) {
          console.error("Failed to load chat messages:", error);
        }
        updateUnreadCount();
        break;
      case "rejected":
      case "cancelled":
        setButtonState("make_request");
        break;
      default:
        setButtonState("make_request");
    }
  };

  const updateUnreadCount = () => {
    if (!user || !request?.id) return;

    const messages = messagesByPeer[request.id] || [];
    const unread = messages.filter(
      (msg) =>
        msg.toUserId === user.id &&
        new Date(msg.sentAt) > new Date(request.updatedAt)
    ).length;

    setUnreadCount(unread);

    // Set last message if there are messages
    if (messages.length > 0) {
      const sortedMessages = messages.sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      );
      const latestMessage = sortedMessages[0];
      setLastMessage(latestMessage.body);
    } else {
      setLastMessage(null);
    }
  };

  const getButtonText = () => {
    switch (buttonState) {
      case "make_request":
        return "Make an Offer";
      case "pending":
        return showSummary ? "Hide Details" : "Pending for Owner";
      case "chat":
        if (unreadCount > 0) {
          return `${unreadCount} new message${unreadCount > 1 ? "s" : ""}`;
        }
        if (lastMessage) {
          // Truncate long messages
          const truncatedMessage =
            lastMessage.length > 30
              ? lastMessage.substring(0, 30) + "..."
              : lastMessage;
          return truncatedMessage;
        }
        return "View Chat";
      default:
        return "Make an Offer";
    }
  };

  const getRequestSummary = () => {
    if (!request) return null;

    const summary = [];

    // Add price information
    summary.push(`$${listing.price}`);

    // Add dates
    if (request.requestedDates) {
      const startDate = new Date(
        request.requestedDates.checkIn
      ).toLocaleDateString();
      const endDate = new Date(
        request.requestedDates.checkOut
      ).toLocaleDateString();
      summary.push(`${startDate} - ${endDate}`);
    }

    // Add message if exists
    if (request.message) {
      const truncatedMessage =
        request.message.length > 50
          ? request.message.substring(0, 50) + "..."
          : request.message;
      summary.push(truncatedMessage);
    }

    return summary;
  };

  const getButtonStyle = () => {
    switch (buttonState) {
      case "make_request":
        return styles.makeRequestButton;
      case "pending":
        return styles.pendingButton;
      case "chat":
        return unreadCount > 0 ? styles.chatButtonUnread : styles.chatButton;
      default:
        return styles.makeRequestButton;
    }
  };

  const getButtonTextStyle = () => {
    switch (buttonState) {
      case "make_request":
        return styles.makeRequestButtonText;
      case "pending":
        return styles.pendingButtonText;
      case "chat":
        return unreadCount > 0
          ? styles.chatButtonTextUnread
          : styles.chatButtonText;
      default:
        return styles.makeRequestButtonText;
    }
  };

  const requestSummary = getRequestSummary();

  const handleButtonPress = () => {
    if (buttonState === "pending") {
      if (!showSummary) {
        setShowSummary(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowSummary(false);
        });
      }
    } else {
      onPress();
    }
  };

  const closeSummary = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSummary(false);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[getButtonStyle(), style]}
        onPress={handleButtonPress}
        activeOpacity={0.8}
      >
        <Text style={getButtonTextStyle()}>{getButtonText()}</Text>

        {buttonState === "chat" && unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Request Summary Popup */}
      <Modal
        visible={showSummary}
        transparent={true}
        animationType="none"
        onRequestClose={closeSummary}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={closeSummary}
        >
          <Animated.View
            style={[
              styles.popupContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.popupHeader}>
                <Text style={styles.popupTitle}>Request Details</Text>
                <TouchableOpacity
                  onPress={closeSummary}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.popupContent}>
                {requestSummary &&
                  requestSummary.map((item, index) => (
                    <View key={index} style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>{item}</Text>
                    </View>
                  ))}
              </View>

              <View style={styles.popupFooter}>
                <Text style={styles.statusText}>
                  Status:{" "}
                  <Text style={styles.statusValue}>Pending Owner Response</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  expandIcon: {
    ...textStyles.caption,
    color: colors.warning[700],
    fontWeight: "600",
    marginLeft: spacing.xs,
    fontSize: 10,
  },
  // Popup Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: withOpacity(colors.neutral[900], "50"),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  popupContainer: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    width: "100%",
    maxWidth: 400,
    ...shadows.xl,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  popupTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontWeight: "600",
  },
  popupContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  summaryBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
    marginTop: 6,
    marginRight: spacing.sm,
  },
  summaryText: {
    ...textStyles.body,
    color: colors.neutral[700],
    flex: 1,
    lineHeight: 20,
  },
  popupFooter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.warning[50],
  },
  statusText: {
    ...textStyles.caption,
    color: colors.warning[700],
    textAlign: "center",
  },
  statusValue: {
    fontWeight: "600",
  },
  makeRequestButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
    minHeight: 32,
  },
  makeRequestButtonText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
    fontSize: 12,
  },
  pendingButton: {
    backgroundColor: colors.warning[50],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.warning[500],
    minHeight: 32,
  },
  pendingButtonText: {
    ...textStyles.caption,
    color: colors.warning[700],
    fontWeight: "600",
    fontSize: 12,
  },
  chatButton: {
    backgroundColor: colors.success[50],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.success[500],
    flexDirection: "row",
    minHeight: 32,
  },
  chatButtonUnread: {
    backgroundColor: colors.success[50],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.success[600],
    flexDirection: "row",
    minHeight: 32,
  },
  chatButtonText: {
    ...textStyles.caption,
    color: colors.success[700],
    fontWeight: "600",
    fontSize: 12,
  },
  chatButtonTextUnread: {
    ...textStyles.caption,
    color: colors.success[700],
    fontWeight: "700",
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.xs,
  },
  unreadBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "700",
    fontSize: 9,
  },
});
