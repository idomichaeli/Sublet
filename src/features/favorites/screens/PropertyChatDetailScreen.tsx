import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useChatStore } from "../../../core/services/messagingStore";
import { useAuthStore } from "../../../core/services/authenticationStore";
import { ChatMessage } from "../../../core/services/messagingApi";
import MessageBubble from "../../../shared/components/ui/ChatMessageBubble";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";

interface ChatDetailScreenProps {
  route: {
    params: {
      chatId: string;
      listing: any;
      propertyTitle: string;
      propertyImage: string;
      location: string;
    };
  };
}

export default function ChatDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { messagesByPeer, send, load } = useChatStore();
  const flatListRef = useRef<FlatList>(null);

  const { chatId, propertyTitle, propertyImage, location } =
    route.params as any;

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  useEffect(() => {
    const chatMessages = messagesByPeer[chatId] || [];
    setMessages(chatMessages);
    setIsLoading(false);

    // Auto-scroll to bottom when new messages arrive
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messagesByPeer, chatId]);

  const loadMessages = async () => {
    try {
      await load(chatId);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user) return;

    const messageBody = messageText.trim();
    setMessageText("");

    try {
      // Find the other user ID (not the current user)
      const otherUserId =
        Object.keys(messagesByPeer).find((id) => id !== user.id) || chatId;
      await send(chatId, messageBody, user.id);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore message text on error
      setMessageText(messageBody);
    }
  };

  const formatMessageTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => {
    const isOwner = item.fromUserId !== user?.id;
    const isLast = index === messages.length - 1;

    return (
      <MessageBubble
        message={item.body}
        isOwner={isOwner}
        timestamp={formatMessageTime(item.sentAt)}
        isLast={isLast}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral[900]} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {propertyTitle}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.neutral[600]}
            />
            <Text style={styles.headerLocation} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
      </View>

      {/* Property Banner */}
      <View style={styles.propertyBanner}>
        <Image source={{ uri: propertyImage }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>{propertyTitle}</Text>
          <Text style={styles.bannerLocation}>📍 {location}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a message…"
              placeholderTextColor={colors.neutral[400]}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                messageText.trim()
                  ? styles.sendButtonActive
                  : styles.sendButtonInactive,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  messageText.trim() ? colors.neutral[0] : colors.neutral[400]
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    ...shadows.sm,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLocation: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  propertyBanner: {
    height: 120,
    position: "relative",
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: withOpacity(colors.neutral[900], "70"),
    padding: spacing.md,
  },
  bannerTitle: {
    ...textStyles.h3,
    color: colors.neutral[0],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  bannerLocation: {
    ...textStyles.caption,
    color: colors.neutral[200],
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: spacing.md,
  },
  inputContainer: {
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    ...textStyles.body,
    color: colors.neutral[900],
    maxHeight: 100,
    paddingVertical: spacing.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  sendButtonActive: {
    backgroundColor: colors.primary[500],
    ...shadows.sm,
  },
  sendButtonInactive: {
    backgroundColor: colors.neutral[200],
  },
});
