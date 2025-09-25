import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../shared/constants/tokens";
import ChatBubble from "./components/ChatBubble";
import EmptyState from "../../shared/components/ui/EmptyState";

interface Chat {
  id: string;
  renterName: string;
  renterImage: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  propertyTitle: string;
}

interface Message {
  id: string;
  text: string;
  isOwner: boolean;
  timestamp: string;
  imageUrl?: string;
}

export default function OwnerChatScreen({ navigation }: any) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  const chats: Chat[] = [
    {
      id: "1",
      renterName: "Sarah Johnson",
      renterImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      lastMessage: "Thank you for accepting my application!",
      timestamp: "2 min ago",
      unreadCount: 0,
      isOnline: true,
      propertyTitle: "2BR Apartment, Tel Aviv",
    },
    {
      id: "2",
      renterName: "Michael Chen",
      renterImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      lastMessage: "When can I schedule a viewing?",
      timestamp: "1 hour ago",
      unreadCount: 2,
      isOnline: false,
      propertyTitle: "Modern Studio, Haifa",
    },
    {
      id: "3",
      renterName: "Emma Davis",
      renterImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      lastMessage: "I'm very interested in your property",
      timestamp: "3 hours ago",
      unreadCount: 1,
      isOnline: true,
      propertyTitle: "Luxury Penthouse, Jerusalem",
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      text: "Hi! I'm very interested in your apartment. I'm a responsible tenant with excellent references.",
      isOwner: false,
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "Hello! Thank you for your interest. I'd be happy to answer any questions you have.",
      isOwner: true,
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      text: "Great! When would be a good time to schedule a viewing?",
      isOwner: false,
      timestamp: "10:35 AM",
    },
    {
      id: "4",
      text: "I'm available this weekend. Would Saturday afternoon work for you?",
      isOwner: true,
      timestamp: "10:37 AM",
    },
    {
      id: "5",
      text: "Perfect! I'll see you then. Thank you so much!",
      isOwner: false,
      timestamp: "10:40 AM",
    },
  ];

  const currentChat = chats.find((chat) => chat.id === activeChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Send message:", messageText);
      setMessageText("");
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => setActiveChat(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.chatImageContainer}>
        <Image source={{ uri: item.renterImage }} style={styles.chatImage} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.renterName}</Text>
          <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
        </View>

        <Text style={styles.chatProperty} numberOfLines={1}>
          {item.propertyTitle}
        </Text>

        <View style={styles.chatFooter}>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble
      message={item.text}
      isOwner={item.isOwner}
      timestamp={item.timestamp}
      imageUrl={item.imageUrl}
    />
  );

  if (activeChat && currentChat) {
    return (
      <View style={styles.container}>
        {/* Chat Header */}
        <View style={styles.chatDetailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setActiveChat(null)}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.chatHeaderContent}>
            <View style={styles.chatHeaderImageContainer}>
              <Image
                source={{ uri: currentChat.renterImage }}
                style={styles.chatHeaderImage}
              />
              {currentChat.isOnline && <View style={styles.onlineIndicator} />}
            </View>

            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName}>
                {currentChat.renterName}
              </Text>
              <Text style={styles.chatHeaderProperty}>
                {currentChat.propertyTitle}
              </Text>
            </View>
          </View>
        </View>

        {/* Property Card */}
        <View style={styles.propertyCard}>
          <Text style={styles.propertyCardTitle}>
            Talking about: {currentChat.propertyTitle}
          </Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={styles.messageInput}>
          <TextInput
            style={styles.textInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor={colors.neutral[400]}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendIcon}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <Text style={styles.headerSubtitle}>
          {chats.length} conversation{chats.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Chat List */}
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="💬"
          title="No conversations yet"
          subtitle="Start chatting with interested renters"
          actionLabel="View Renters"
          onActionPress={() => navigation.navigate("InterestedRenters")}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  chatImageContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.neutral[200],
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success[500],
    borderWidth: 2,
    borderColor: colors.neutral[0],
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  chatName: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  chatTimestamp: {
    ...textStyles.caption,
    color: colors.neutral[500],
  },
  chatProperty: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    ...textStyles.body,
    color: colors.neutral[600],
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  unreadText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontSize: 12,
    fontWeight: "600",
  },
  chatDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  backIcon: {
    fontSize: 24,
    color: colors.neutral[700],
  },
  chatHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chatHeaderImageContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  chatHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[200],
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  chatHeaderProperty: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  propertyCard: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  propertyCardTitle: {
    ...textStyles.body,
    color: colors.primary[700],
    fontWeight: "500",
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: spacing.lg,
    paddingBottom: 120, // Extra padding for floating nav bar (80px height + 16px margin + 24px extra)
  },
  messageInput: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    maxHeight: 100,
    ...textStyles.body,
    color: colors.neutral[900],
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: {
    fontSize: 20,
  },
});
