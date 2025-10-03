import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, textStyles } from "../../shared/constants/tokens";
import { useFavoritesStore } from "../../core/services/savedPropertiesStore";
import SwipeCard from "./components/SwipeCard";
import { renterPropertyService } from "../../core/services/renterPropertyService";
import { SwipeCardData } from "./components/SwipeCard";
import { useState, useEffect } from "react";

export default function FavoritesScreen() {
  const { favorites } = useFavoritesStore();
  const [isLoading, setIsLoading] = useState(false);

  // Since favorites now contains full SwipeCardData objects directly, we don't need to fetch and filter
  const favoriteApartments = favorites;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteApartments.length} saved apartments
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {favoriteApartments.length > 0 ? (
          <View style={styles.list}>
            {favoriteApartments.map((apartment) => (
              <View key={apartment.id} style={styles.cardContainer}>
                <SwipeCard data={apartment} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Start swiping to save apartments you like!
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  list: {
    gap: spacing.lg,
  },
  cardContainer: {
    marginBottom: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
  },
});
