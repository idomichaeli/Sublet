import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../shared/constants/tokens";
import { useFavoritesStore } from "../../shared/hooks/state/favoritesStore";
import SwipeCard from "./components/SwipeCard";
import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";
import EmptyState from "../../shared/components/ui/EmptyState";
import AreaStories from "../../shared/components/ui/AreaStories";
import RequestButton from "../favorites/components/RequestButton";
import MakeRequestBottomSheet from "../favorites/MakeRequestBottomSheet";
import { locations } from "../../shared/constants/locations";
import { useRequestStore } from "../../shared/hooks/state/requestStore";
import { mockApartments } from "../../shared/data/mockApartments";

export default function SavedPropertiesScreen() {
  const { favorites } = useFavoritesStore();
  const { addRequest } = useRequestStore();
  const [showRequestSheet, setShowRequestSheet] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState<string | null>(
    null
  );

  const favoriteApartments = mockApartments.filter((apartment) =>
    favorites.includes(apartment.id)
  );

  const handleMakeRequest = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setShowRequestSheet(true);
  };

  const handleSubmitRequest = (message: string) => {
    if (selectedProperty) {
      addRequest({
        id: Date.now().toString(),
        propertyId: selectedProperty,
        renterId: "current-user",
        ownerId: "property-owner",
        status: "pending",
        message,
        requestedDates: {
          checkIn: new Date().toISOString(),
          checkOut: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        guests: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setSelectedProperty(null);
  };

  const areaStories = locations.slice(0, 4).map((location, index) => ({
    id: (index + 1).toString(),
    title: location,
    image: "",
    apartments: Math.floor(Math.random() * 20) + 5,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Properties</Text>
        <Text style={styles.subtitle}>
          {favoriteApartments.length} saved apartments
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {favoriteApartments.length > 0 ? (
          <>
            <View style={styles.list}>
              {favoriteApartments.map((apartment) => (
                <View key={apartment.id} style={styles.cardContainer}>
                  <SwipeCard data={apartment} />
                  <View style={styles.actions}>
                    <RequestButton
                      onPress={() => handleMakeRequest(apartment.id)}
                    />
                  </View>
                </View>
              ))}
            </View>

            <Card style={styles.areaStoriesCard}>
              <AreaStories stories={areaStories} />
            </Card>
          </>
        ) : (
          <EmptyState
            icon="❤️"
            title="No favorites yet"
            subtitle="Start swiping to save apartments you like!"
            buttonText="Start Browsing"
            onButtonPress={() => {}}
          />
        )}
      </ScrollView>

      <MakeRequestBottomSheet
        visible={showRequestSheet}
        onClose={() => setShowRequestSheet(false)}
        onSubmit={handleSubmitRequest}
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
    marginBottom: spacing.xl,
  },
  cardContainer: {
    marginBottom: spacing.lg,
  },
  actions: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  areaStoriesCard: {
    marginBottom: spacing.xl,
  },
});
