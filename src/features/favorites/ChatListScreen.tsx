import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../shared/constants/tokens";

interface ChatItem {
  id: string;
  propertyTitle: string;
  ownerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const mockChats: ChatItem[] = [
  {
    id: "1",
    propertyTitle: "Modern Studio in Tel Aviv",
    ownerName: "John Doe",
    lastMessage: "Thanks for your interest! When would you like to visit?",
    timestamp: "2 hours ago",
    unreadCount: 2,
  },
  {
    id: "2",
    propertyTitle: "Cozy 2BR Apartment",
    ownerName: "Jane Smith",
    lastMessage: "The property is still available.",
    timestamp: "1 day ago",
    unreadCount: 0,
  },
];

export default function ChatListScreen({ navigation }: any) {
  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("ChatDetail", { chatId: item.id })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.ownerName[0]}</Text>
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.propertyTitle}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>

        <View style={styles.chatFooter}>
          <Text style={styles.ownerName}>{item.ownerName}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>

        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <FlatList
        data={mockChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    borderBottomColor: colors.neutral[100],
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
  },
  listContent: {
    padding: spacing.md,
  },
  chatItem: {
    flexDirection: "row",
    backgroundColor: colors.neutral[0],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
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
  propertyTitle: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.sm,
  },
  timestamp: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  ownerName: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  unreadBadge: {
    backgroundColor: colors.primary[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
  },
  unreadText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontSize: 10,
    fontWeight: "600",
  },
  lastMessage: {
    ...textStyles.caption,
    color: colors.neutral[700],
  },
});
