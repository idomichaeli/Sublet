import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRequestStore } from "../../../core/services/rentalRequestStore";
import { useChatStore } from "../../../core/services/messagingStore";
import { useAuthStore } from "../../../core/services/authenticationStore";
import { useFavoritesStore } from "../../../core/services/savedPropertiesStore";
import { SwipeCardData } from "../../swipe/components/SwipeCard";
import { Request } from "../../../core/types/rentalRequest";
import ChatListItem from "../components/PropertyChatListItem";
import EmptyState from "../../../shared/components/ui/EmptyState";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";

interface ChatItem {
  id: string;
  propertyImage: string;
  propertyTitle: string;
  location: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  chatId: string;
  listing: SwipeCardData;
}

export default function ChatListScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const { getRequestByListing, refreshRequest } = useRequestStore();
  const { messagesByPeer, load } = useChatStore();

  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadChatItems();
    }, [favorites, user])
  );

  const loadChatItems = async () => {
    if (!user) return;

    setIsLoading(true);
    const items: ChatItem[] = [];

    // Get all approved requests for user's favorites
    for (const favorite of favorites) {
      try {
        // Refresh request data
        await refreshRequest(favorite.id);
        const request = getRequestByListing(favorite.id);

        if (request && request.status === "approved") {
          // Load chat messages
          await load(request.id);
          const messages = messagesByPeer[request.id] || [];

          // Calculate unread count
          const unreadCount = messages.filter(
            (msg) =>
              msg.toUserId === user.id &&
              new Date(msg.sentAt) > new Date(request.updatedAt)
          ).length;

          // Get last message
          const sortedMessages = messages.sort(
            (a, b) =>
              new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
          );
          const lastMessage =
            sortedMessages.length > 0
              ? sortedMessages[0].body
              : "No messages yet";

          // Format timestamp
          const timestamp =
            sortedMessages.length > 0
              ? formatTimestamp(sortedMessages[0].sentAt)
              : "Just now";

          items.push({
            id: request.id,
            propertyImage: favorite.imageUrl,
            propertyTitle: favorite.title,
            location: favorite.location,
            lastMessage,
            timestamp,
            unreadCount,
            chatId: request.id,
            listing: favorite,
          });
        }
      } catch (error) {
        console.error(`Failed to load chat for listing ${favorite.id}:`, error);
      }
    }

    // Sort by last message time
    items.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return bTime - aTime;
    });

    setChatItems(items);
    setIsLoading(false);
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return messageDate.toLocaleDateString();
  };

  const handleChatPress = (chatItem: ChatItem) => {
    navigation.navigate("ChatDetail", {
      chatId: chatItem.chatId,
      listing: chatItem.listing,
      propertyTitle: chatItem.propertyTitle,
      propertyImage: chatItem.propertyImage,
      location: chatItem.location,
    });
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <ChatListItem
      propertyImage={item.propertyImage}
      propertyTitle={item.propertyTitle}
      location={item.location}
      lastMessage={item.lastMessage}
      timestamp={item.timestamp}
      unreadCount={item.unreadCount}
      onPress={() => handleChatPress(item)}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
          <Text style={styles.headerSubtitle}>Loading conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <Text style={styles.headerSubtitle}>
          {chatItems.length} conversation{chatItems.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {chatItems.length > 0 ? (
        <FlatList
          data={chatItems}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          contentContainerStyle={styles.chatListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="💬"
          title="No chats yet"
          subtitle="Once an owner approves you, conversations will appear here."
          actionLabel="Browse Properties"
          onActionPress={() => navigation.navigate("Home")}
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
  chatListContent: {
    paddingVertical: spacing.md,
    paddingBottom: 120, // Extra padding for floating nav bar
  },
});
