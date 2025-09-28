import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, textStyles } from "../../shared/constants/tokens";
import FavoritesScreen from "./FavoritesScreen";
import ChatScreen from "./ChatScreen";
import { FavoritesTabProvider } from "../../shared/hooks/state/FavoritesTabContext";

export default function SavedPropertiesTabScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FavoritesTabProvider>
        <View style={styles.content}>
          <Text style={styles.title}>Saved Properties</Text>
          <FavoritesScreen />
        </View>
      </FavoritesTabProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.lg,
  },
});
