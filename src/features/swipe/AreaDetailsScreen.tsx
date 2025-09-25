import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SwipeCardData } from "./components/SwipeCard";
import { TelAvivLocation } from "../../shared/constants/locations";
import {
  colors,
  spacing,
  textStyles,
  shadows,
} from "../../shared/constants/tokens";
import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";

interface AreaDetailsScreenProps {
  route: {
    params: {
      area: TelAvivLocation;
      apartments: SwipeCardData[];
    };
  };
  navigation: any;
}

export default function AreaDetailsScreen({
  route,
  navigation,
}: AreaDetailsScreenProps) {
  const { area, apartments } = route.params;

  const handleApartmentPress = (apartmentId: string) => {
    navigation.navigate("ListingDetails", { listingId: apartmentId });
  };

  const handleChatPress = (apartmentId: string) => {
    navigation.navigate("Chat", { listingId: apartmentId });
  };

  const renderApartmentItem = ({ item }: { item: SwipeCardData }) => (
    <Card style={styles.apartmentCard} shadow="md">
      <TouchableOpacity
        onPress={() => handleApartmentPress(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.priceUnit}>/night</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detail}>
              {item.rooms} room{item.rooms !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.detailSeparator}>•</Text>
            <Text style={styles.detail}>
              {item.bathrooms} bathroom{item.bathrooms !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.detailSeparator}>•</Text>
            <Text style={styles.detail}>{item.size}m²</Text>
          </View>

          {item.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
            </View>
          )}

          <View style={styles.actionsContainer}>
            <Button
              title="Chat with Property"
              variant="primary"
              size="sm"
              style={styles.chatButton}
              onPress={() => handleChatPress(item.id)}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{area.name}</Text>
          <Text style={styles.headerSubtitle}>{area.description}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{apartments.length}</Text>
          <Text style={styles.statLabel}>
            Favorite{apartments.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            $
            {Math.round(
              apartments.reduce((sum, apt) => sum + apt.price, 0) /
                apartments.length
            )}
          </Text>
          <Text style={styles.statLabel}>Avg. Price</Text>
        </View>
      </View>

      <FlatList
        data={apartments}
        renderItem={renderApartmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Your Favorites in {area.name}</Text>
            <Text style={styles.listSubtitle}>
              {apartments.length} apartment{apartments.length !== 1 ? "s" : ""}{" "}
              saved
            </Text>
          </View>
        }
      />
    </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  backIcon: {
    fontSize: 20,
    color: colors.neutral[700],
    fontWeight: "600",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: 2,
  },
  headerSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  listHeader: {
    marginBottom: spacing.lg,
  },
  listTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  listSubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  apartmentCard: {
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  imageContainer: {
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontSize: 18,
    fontWeight: "700",
  },
  priceUnit: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  detail: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  detailSeparator: {
    ...textStyles.caption,
    color: colors.neutral[400],
    marginHorizontal: spacing.xs,
  },
  ratingContainer: {
    marginBottom: spacing.md,
  },
  rating: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  chatButton: {
    minWidth: 140,
  },
});
