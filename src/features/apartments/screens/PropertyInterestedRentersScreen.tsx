import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
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

type FilterType = "all" | "pending" | "accepted" | "rejected";

export default function InterestedRentersScreen({ navigation }: any) {
  const [selectedProperty, setSelectedProperty] = useState<string>("1");

  const ownerProperties = [
    {
      id: "1",
      title: "Downtown Apartment",
      imageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      price: 150,
      location: "Tel Aviv",
    },
    {
      id: "2",
      title: "Modern Studio",
      imageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      price: 120,
      location: "Haifa",
    },
    {
      id: "3",
      title: "Luxury Penthouse",
      imageUrl:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      price: 300,
      location: "Jerusalem",
    },
    {
      id: "4",
      title: "Cozy 2BR",
      imageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      price: 180,
      location: "Ramat Gan",
    },
  ];

  const interestedRenters = [
    {
      id: "1",
      name: "Sarah Johnson",
      age: 28,
      occupation: "Software Engineer",
      location: "Tel Aviv",
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      isVerified: true,
      propertyTitle: "2BR Apartment, Tel Aviv",
      propertyImage:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100",
      budget: "$1,200/month",
      moveInDate: "Jan 15, 2024",
      messagePreview:
        "Hi! I'm very interested in your apartment. I'm a responsible tenant with excellent references...",
      status: "pending" as const,
      ownerPrice: 4500, // Owner's asking price per month
      renterSuggestedPrice: 4800, // Renter's suggested price per month (+$300)
      startDate: "Jan 15",
      endDate: "Dec 15",
    },
    {
      id: "2",
      name: "Michael Chen",
      age: 24,
      occupation: "Graduate Student",
      location: "Haifa",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      isVerified: false,
      propertyTitle: "Modern Studio, Haifa",
      propertyImage:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100",
      budget: "$800/month",
      moveInDate: "Feb 1, 2024",
      messagePreview:
        "Hello! I would love to schedule a viewing. I'm available this weekend...",
      status: "accepted" as const,
      ownerPrice: 3600, // Owner's asking price per month
      renterSuggestedPrice: 3300, // Renter's suggested price per month (-$300)
      startDate: "Feb 1",
      endDate: "Aug 1",
    },
    {
      id: "3",
      name: "Emma Davis",
      age: 31,
      occupation: "Marketing Manager",
      location: "Jerusalem",
      profileImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      isVerified: true,
      propertyTitle: "Luxury Penthouse, Jerusalem",
      propertyImage:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100",
      budget: "$2,500/month",
      moveInDate: "Mar 1, 2024",
      messagePreview:
        "This property looks perfect for my needs. I'm ready to move forward...",
      status: "rejected" as const,
      ownerPrice: 9000, // Owner's asking price per month
      renterSuggestedPrice: 8400, // Renter's suggested price per month (-$600)
      startDate: "Mar 1",
      endDate: "Sep 1",
    },
    {
      id: "4",
      name: "David Wilson",
      age: 26,
      occupation: "Software Engineer",
      location: "Ramat Gan",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isVerified: true,
      propertyTitle: "2BR Apartment, Tel Aviv",
      propertyImage:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100",
      budget: "$1,100/month",
      moveInDate: "Jan 20, 2024",
      messagePreview:
        "I'm a software engineer looking for a quiet place to work from home...",
      status: "pending" as const,
      ownerPrice: 4500, // Owner's asking price per month
      renterSuggestedPrice: 4500, // Renter's suggested price per month (same)
      startDate: "Jan 20",
      endDate: "Jul 20",
    },
  ];

  const filteredRenters = interestedRenters.filter((renter) => {
    // Filter renters based on the selected property
    // For now, we'll use a simple mapping based on property titles
    const propertyMapping: { [key: string]: string[] } = {
      "1": ["Downtown Apartment", "2BR Apartment, Tel Aviv"], // Downtown Apartment
      "2": ["Modern Studio, Haifa"], // Modern Studio
      "3": ["Luxury Penthouse, Jerusalem"], // Luxury Penthouse
      "4": ["2BR Apartment, Tel Aviv", "Cozy 2BR"], // Cozy 2BR
    };

    const selectedPropertyTitles = propertyMapping[selectedProperty] || [];
    return selectedPropertyTitles.some((title) =>
      renter.propertyTitle
        .toLowerCase()
        .includes(title.toLowerCase().split(",")[0])
    );
  });

  const handleAccept = (renterId: string) => {
    console.log("Accept renter:", renterId);
    // Update renter status to accepted
  };

  const handleReject = (renterId: string) => {
    console.log("Reject renter:", renterId);
    // Update renter status to rejected
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

  const renderPropertyStory = ({
    item,
  }: {
    item: (typeof ownerProperties)[0];
  }) => (
    <PropertyStory
      {...item}
      isActive={selectedProperty === item.id}
      onPress={() => setSelectedProperty(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Interested Renters</Text>
        <Text style={styles.headerSubtitle}>
          {filteredRenters.length} renter
          {filteredRenters.length !== 1 ? "s" : ""} interested in{" "}
          {ownerProperties.find((p) => p.id === selectedProperty)?.title}
        </Text>
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
              {...property}
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
              ownerProperties.find((p) => p.id === selectedProperty)?.title
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
