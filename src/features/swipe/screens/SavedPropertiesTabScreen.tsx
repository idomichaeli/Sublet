import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";
import FavoritesScreen from "./SavedPropertiesScreen";
// import ChatScreen from "./ChatScreen";
import { useFavoritesTab } from "../../../shared/hooks/state/FavoritesTabContext";

type TabOption = "favorites" | "chat";

export default function FavoritesTabScreen({ navigation }: any) {
  const { activeTab, setActiveTab } = useFavoritesTab();

  const renderTabButton = (
    tab: TabOption,
    label: string,
    icon: keyof typeof Ionicons.glyphMap
  ) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={20}
        color={activeTab === tab ? colors.primary[500] : colors.neutral[600]}
      />
      <Text
        style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "favorites":
        return <FavoritesScreen navigation={navigation} />;
      case "chat":
        return <FavoritesScreen navigation={navigation} />; // Placeholder for chat
      default:
        return <FavoritesScreen navigation={navigation} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        {renderTabButton("favorites", "Favorites", "heart-outline")}
        {renderTabButton("chat", "Chats", "chatbubble-outline")}
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    gap: spacing.xs,
  },
  activeTabButton: {
    backgroundColor: colors.primary[50],
  },
  tabLabel: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontWeight: "500",
  },
  activeTabLabel: {
    color: colors.primary[500],
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
  },
});
