import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../../shared/constants/tokens";
import RenterCard from "../components/PropertyRenterCard";
import PropertyStory from "../components/PropertyOwnerStory";
import EmptyState from "../../../shared/components/ui/EmptyState";
import { useOwnerPropertyList } from "../../../core/services/ownerPropertyListManager";
import { OwnerProperty } from "../../../core/types/ownerPropertyList";
import offersManager from "../../../core/services/offersManager";
import { OfferObject } from "../../../core/types/offerObject";

type FilterType = "all" | "pending" | "accepted" | "rejected";

export default function InterestedRentersScreen({ navigation }: any) {
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [ownerProperties, setOwnerProperties] = useState<OwnerProperty[]>([]);
  const [offers, setOffers] = useState<OfferObject[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const ownerPropertyList = useOwnerPropertyList("current-owner");

  // Load owner properties and offers on component mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        if (ownerPropertyList.reloadFromStorage) {
          await ownerPropertyList.reloadFromStorage();
        }
        const publishedProperties = ownerPropertyList.getPublishedProperties();
        setOwnerProperties(publishedProperties);

        // Set first property as selected if available
        if (publishedProperties.length > 0 && !selectedProperty) {
          setSelectedProperty(publishedProperties[0].id);
        }
      } catch (error) {
        console.error("Failed to load properties:", error);
      }
    };

    const loadOffers = async () => {
      try {
        setIsLoadingOffers(true);
        const ownerOffers = await offersManager.getOffersForOwner(
          "current-owner"
        );
        setOffers(ownerOffers);

        // Subscribe to real-time updates
        const unsubscribe = offersManager.subscribe(
          "owner_current-owner",
          (updatedOffers) => {
            setOffers(updatedOffers);
          }
        );

        // Store unsubscribe function for cleanup
        return unsubscribe;
      } catch (error) {
        console.error("Failed to load offers:", error);
      } finally {
        setIsLoadingOffers(false);
      }
    };

    loadProperties();
    loadOffers();
  }, []);

  // Reload offers when selected property changes
  useEffect(() => {
    const loadOffers = async () => {
      try {
        setIsLoadingOffers(true);
        const ownerOffers = await offersManager.getOffersForOwner(
          "current-owner"
        );
        setOffers(ownerOffers);

        // Subscribe to real-time updates
        const unsubscribe = offersManager.subscribe(
          "owner_current-owner",
          (updatedOffers) => {
            setOffers(updatedOffers);
          }
        );

        // Store unsubscribe function for cleanup
        return unsubscribe;
      } catch (error) {
        console.error("Failed to load offers:", error);
      } finally {
        setIsLoadingOffers(false);
      }
    };

    loadOffers();
  }, [selectedProperty]);

  // Convert OwnerProperty to PropertyStory format
  const getPropertyStoryData = (property: OwnerProperty) => ({
    id: property.id,
    title: `${
      property.propertyCategory === "house" ? "House" : "Apartment"
    } • ${property.area?.name || "Tel Aviv"}`,
    imageUrl:
      property.photos && property.photos.length > 0
        ? property.photos[0]
        : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", // Default image
    price: property.price,
    location: property.area?.name || "Tel Aviv",
  });

  // Convert OfferObject to RenterCard format for display
  const convertOfferToRenterCard = (offer: OfferObject) => {
    const startDateObj = new Date(offer.renterStartDate);
    const endDateObj = new Date(offer.renterEndDate);

    return {
      id: offer.id,
      name: offer.renterName,
      age: offer.renterAge,
      occupation: offer.renterOccupation,
      location: offer.renterLocation,
      profileImage: offer.renterProfileImage,
      isVerified: offer.renterIsVerified,
      propertyTitle: offer.propertyTitle,
      propertyImage: offer.propertyImage,
      budget: `$${offer.renterOfferPrice}/month`,
      moveInDate: startDateObj.toLocaleDateString(),
      messagePreview: offer.messagePreview,
      status: offer.status as "pending" | "accepted" | "rejected",
      ownerPrice: offer.ownerPrice,
      renterSuggestedPrice: offer.renterOfferPrice,
      startDate: startDateObj.toLocaleDateString(),
      endDate: endDateObj.toLocaleDateString(),
    };
  };

  // Convert offers to renter cards format
  const interestedRenters = offers.map(convertOfferToRenterCard);

  const filteredRenters = interestedRenters.filter((renter) => {
    // Filter by selected property first
    if (selectedProperty) {
      const matchingOffer = offers.find((o) => o.id === renter.id);
      if (matchingOffer && matchingOffer.propertyId !== selectedProperty) {
        return false;
      }
    }

    // Apply status filter
    if (filterType !== "all" && renter.status !== filterType) {
      return false;
    }

    return true;
  });

  const handleAccept = async (offerId: string) => {
    try {
      const result = await offersManager.updateOfferStatus(
        offerId,
        "accepted",
        {
          id: "current-owner",
          name: "Property Owner",
        }
      );

      if (result.success) {
        console.log("✅ Offer accepted:", offerId);
        // Offers will automatically update via subscription
      } else {
        console.error("Failed to accept offer");
      }
    } catch (error) {
      console.error("Failed to accept offer:", error);
    }
  };

  const handleReject = async (offerId: string) => {
    try {
      const result = await offersManager.updateOfferStatus(
        offerId,
        "rejected",
        {
          id: "current-owner",
          name: "Property Owner",
        }
      );

      if (result.success) {
        console.log("❌ Offer rejected:", offerId);
        // Offers will automatically update via subscription
      } else {
        console.error("Failed to reject offer");
      }
    } catch (error) {
      console.error("Failed to reject offer:", error);
    }
  };

  const handleChat = (renterId: string) => {
    navigation.navigate("Chat", { renterId });
  };

  const handleRenterPress = (renterId: string) => {
    console.log("Renter pressed:", renterId);
    // Navigate to renter profile or details
  };

  const renderRenter = ({ item }: { item: (typeof interestedRenters)[0] }) => (
    <RenterCard
      {...item}
      onAccept={() => handleAccept(item.id)}
      onReject={() => handleReject(item.id)}
      onChatPress={() => handleChat(item.id)}
      onPress={() => handleRenterPress(item.id)}
    />
  );

  const renderPropertyStory = ({ item }: { item: OwnerProperty }) => (
    <PropertyStory
      {...getPropertyStoryData(item)}
      isActive={selectedProperty === item.id}
      onPress={() => setSelectedProperty(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offers & Requests</Text>
        <Text style={styles.headerSubtitle}>
          {filteredRenters.length} offer
          {filteredRenters.length !== 1 ? "s" : ""}{" "}
          {filterType !== "all" && `(${filterType})`}
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          {(["all", "pending", "accepted", "rejected"] as FilterType[]).map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  filterType === filter && styles.filterButtonActive,
                ]}
                onPress={() => setFilterType(filter)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterType === filter && styles.filterButtonTextActive,
                  ]}
                >
                  {filter === "all"
                    ? "All"
                    : filter === "pending"
                    ? "Pending"
                    : filter === "accepted"
                    ? "Accepted"
                    : "Rejected"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* Property Stories */}
      <View style={styles.storiesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesScrollContent}
        >
          {ownerProperties.map((property) => (
            <PropertyStory
              key={property.id}
              {...getPropertyStoryData(property)}
              isActive={selectedProperty === property.id}
              onPress={() => setSelectedProperty(property.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {filteredRenters.length > 0 ? (
          <FlatList
            data={filteredRenters}
            renderItem={renderRenter}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <EmptyState
            icon="👥"
            title="No interested renters yet"
            subtitle={`No one has applied to ${
              ownerProperties.find((p) => p.id === selectedProperty)
                ? getPropertyStoryData(
                    ownerProperties.find((p) => p.id === selectedProperty)!
                  ).title
                : "this property"
            } yet. When someone does, they'll show up here!`}
            actionLabel="View Properties"
            onActionPress={() => navigation.navigate("Home")}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
  filterContainer: {
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    paddingVertical: spacing.sm,
  },
  filterButtons: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterButtonActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  filterButtonText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: colors.primary[600],
    fontWeight: "600",
  },
  storiesContainer: {
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    paddingVertical: spacing.md,
  },
  storiesScrollContent: {
    paddingHorizontal: spacing.lg,
    paddingRight: spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  listContainer: {
    paddingBottom: 140, // Extra padding for floating nav bar (80px height + 16px margin + 44px extra)
    paddingTop: spacing.sm,
  },
});
