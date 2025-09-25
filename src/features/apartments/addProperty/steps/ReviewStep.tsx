import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../../shared/constants/tokens";
import Card from "../../../../shared/components/ui/Card";
import { StepProps } from "../types/PropertyData";

const AMENITIES = [
  { id: "furnished", label: "Furnished", icon: "🛋️" },
  { id: "pet_friendly", label: "Pet-friendly", icon: "🐕" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "parking", label: "Parking", icon: "🚗" },
  { id: "balcony", label: "Balcony", icon: "🌅" },
  { id: "elevator", label: "Elevator", icon: "🛗" },
  { id: "wifi", label: "WiFi", icon: "📶" },
  { id: "gym", label: "Gym", icon: "💪" },
  { id: "pool", label: "Pool", icon: "🏊" },
  { id: "laundry", label: "Laundry", icon: "🧺" },
  { id: "dishwasher", label: "Dishwasher", icon: "🍽️" },
  { id: "heating", label: "Heating", icon: "🔥" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "storage", label: "Storage", icon: "📦" },
  { id: "garden", label: "Garden", icon: "🌳" },
];

export default function ReviewStep({ data, onUpdate }: StepProps) {
  const getRenovationLabel = (renovation: string) => {
    switch (renovation) {
      case "new":
        return "✨ New";
      case "renovated":
        return "🛠️ Renovated";
      case "needs_work":
        return "🏚️ Needs work";
      default:
        return "Unknown";
    }
  };

  const getSelectedAmenities = () => {
    return data.amenities
      .map((id) => AMENITIES.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  // Calculate total rooms including bedrooms, living room, and additional rooms
  const calculateTotalRooms = () => {
    let totalRooms = 0;

    // Add bedrooms (use customBedrooms if available, otherwise use bedrooms)
    const bedroomCount = data.customBedrooms || data.bedrooms;
    totalRooms += bedroomCount;

    // Add living room if it exists (separate from bedrooms)
    if (data.isOneBedroomLivingRoom) {
      totalRooms += 1;
    }

    // Add additional rooms count
    totalRooms += data.additionalRooms?.length || 0;

    return totalRooms;
  };

  const getRoomBreakdown = () => {
    const bedroomCount = data.customBedrooms || data.bedrooms;
    const bathroomCount = data.customBathrooms || data.bathrooms;
    const additionalRoomsCount = data.additionalRooms?.length || 0;
    const hasLivingRoom = data.isOneBedroomLivingRoom;

    let breakdown = [];

    // Bedrooms
    breakdown.push(`${bedroomCount} bedroom${bedroomCount !== 1 ? "s" : ""}`);

    // Living room
    if (hasLivingRoom) {
      breakdown.push("1 living room");
    }

    // Additional rooms
    if (additionalRoomsCount > 0) {
      breakdown.push(
        `${additionalRoomsCount} additional room${
          additionalRoomsCount !== 1 ? "s" : ""
        }`
      );
    }

    // Bathrooms
    breakdown.push(
      `${bathroomCount} bathroom${bathroomCount !== 1 ? "s" : ""}`
    );

    return breakdown.join(" • ");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>🏠 Review & Publish</Text>
        <Text style={styles.subtitle}>
          Review your listing before publishing
        </Text>
      </View>

      {/* Property Overview Card */}
      <Card style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Property Overview</Text>
          <View style={styles.totalRoomsBadge}>
            <Text style={styles.totalRoomsText}>
              {calculateTotalRooms()} Total Rooms
            </Text>
          </View>
        </View>

        <View style={styles.propertyHighlights}>
          <View style={styles.highlightItem}>
            <Text style={styles.highlightIcon}>🏠</Text>
            <Text style={styles.highlightText}>{getRoomBreakdown()}</Text>
          </View>
          <View style={styles.highlightItem}>
            <Text style={styles.highlightIcon}>📏</Text>
            <Text style={styles.highlightText}>{data.size}m²</Text>
          </View>
          <View style={styles.highlightItem}>
            <Text style={styles.highlightIcon}>💰</Text>
            <Text style={styles.highlightText}>
              ${data.price.toLocaleString()}/month
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.reviewCard}>
        <View style={styles.reviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>👤</Text>
            <Text style={styles.reviewLabel}>Contact Information</Text>
          </View>
          <Text style={styles.reviewValue}>{data.name}</Text>
          <Text style={styles.reviewValue}>{data.email}</Text>
          <Text style={styles.reviewValue}>{data.phone}</Text>
        </View>

        <View style={styles.reviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <Text style={styles.reviewLabel}>Location</Text>
          </View>
          <Text style={styles.reviewValue}>
            {data.area?.name || "Not selected"}
          </Text>
          <Text style={styles.reviewValue}>
            {data.location?.address || "Address not set"}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏠</Text>
            <Text style={styles.reviewLabel}>Property Details</Text>
          </View>
          <Text style={styles.reviewValue}>{getRoomBreakdown()}</Text>
          <Text style={styles.reviewValue}>
            Status: {getRenovationLabel(data.renovation)}
          </Text>
          {data.additionalRooms && data.additionalRooms.length > 0 && (
            <View style={styles.additionalRoomsContainer}>
              <Text style={styles.additionalRoomsLabel}>Additional Rooms:</Text>
              <View style={styles.additionalRoomsList}>
                {data.additionalRooms.map((room, index) => (
                  <View key={index} style={styles.additionalRoomChip}>
                    <Text style={styles.additionalRoomText}>{room}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.reviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>✨</Text>
            <Text style={styles.reviewLabel}>Amenities</Text>
          </View>
          <Text style={styles.reviewValue}>
            {data.amenities.length > 0
              ? getSelectedAmenities()
              : "None selected"}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📅</Text>
            <Text style={styles.reviewLabel}>Pricing & Availability</Text>
          </View>
          <Text style={styles.reviewValue}>
            ${data.price.toLocaleString()}/month
          </Text>
          <Text style={styles.reviewValue}>
            {data.availableFrom
              ? `Available from ${data.availableFrom}`
              : "Available now"}
          </Text>
          {data.availableTo && (
            <Text style={styles.reviewValue}>
              Available until {data.availableTo}
            </Text>
          )}
        </View>

        <View style={styles.reviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📸</Text>
            <Text style={styles.reviewLabel}>Photos</Text>
          </View>
          <Text style={styles.reviewValue}>
            {data.photos.length} photo{data.photos.length !== 1 ? "s" : ""}{" "}
            uploaded
          </Text>
        </View>
      </Card>

      <View style={styles.publishInfo}>
        <Text style={styles.publishInfoTitle}>🚀 Ready to Publish!</Text>
        <Text style={styles.publishInfoText}>
          Your property will be visible to renters immediately after publishing.
        </Text>
        <Text style={styles.publishInfoText}>
          You can edit or unpublish your listing anytime from your dashboard.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
  },
  overviewCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
    borderWidth: 2,
    borderColor: colors.primary[200],
    ...shadows.sm,
  },
  overviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  overviewTitle: {
    ...textStyles.h3,
    color: colors.primary[700],
    fontWeight: "600",
  },
  totalRoomsBadge: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  totalRoomsText: {
    ...textStyles.caption,
    color: colors.white,
    fontWeight: "600",
  },
  propertyHighlights: {
    gap: spacing.sm,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.xs,
  },
  highlightIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  highlightText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "500",
    flex: 1,
  },
  reviewCard: {
    marginBottom: spacing.lg,
  },
  reviewSection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  reviewLabel: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "600",
  },
  reviewValue: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  additionalRoomsContainer: {
    marginTop: spacing.sm,
  },
  additionalRoomsLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  additionalRoomsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  additionalRoomChip: {
    backgroundColor: colors.secondary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  additionalRoomText: {
    ...textStyles.caption,
    color: colors.secondary[700],
    fontWeight: "500",
  },
  publishInfo: {
    backgroundColor: colors.success[50],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.success[200],
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  publishInfoTitle: {
    ...textStyles.h3,
    color: colors.success[700],
    fontWeight: "600",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  publishInfoText: {
    ...textStyles.body,
    color: colors.success[600],
    marginBottom: spacing.xs,
    textAlign: "center",
  },
});
