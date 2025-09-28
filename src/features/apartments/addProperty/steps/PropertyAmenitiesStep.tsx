import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
} from "../../../../shared/constants/tokens";
import Chip from "../../../../shared/components/ui/Chip";
import { StepProps } from "../types/PropertyCreationData";

const REQUIRED_AMENITIES = [
  { id: "wifi", label: "WiFi", icon: "📶" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "elevator", label: "Elevator", icon: "🛗" },
  { id: "furnished", label: "Furnished", icon: "🛋️" },
  { id: "pet_friendly", label: "Pet-friendly", icon: "🐕" },
  { id: "smoking_allowed", label: "Smoking Allowed", icon: "🚬" },
  { id: "accessible", label: "Accessible", icon: "♿" },
];

const OPTIONAL_AMENITIES = [
  { id: "heating", label: "Heating", icon: "🔥" },
  { id: "parking", label: "Parking", icon: "🚗" },
  { id: "balcony", label: "Balcony", icon: "🌅" },
  { id: "gym", label: "Gym", icon: "💪" },
  { id: "pool", label: "Pool", icon: "🏊" },
  { id: "laundry", label: "Laundry", icon: "🧺" },
  { id: "storage", label: "Storage", icon: "📦" },
  { id: "garden", label: "Garden", icon: "🌳" },
  { id: "rooftop", label: "Rooftop", icon: "🏢" },
];

export default function AmenitiesStep({ data, onUpdate }: StepProps) {
  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = data.amenities.includes(amenityId)
      ? data.amenities.filter((id) => id !== amenityId)
      : [...data.amenities, amenityId];
    onUpdate({ amenities: newAmenities });
  };

  const renderAmenitiesSection = (
    amenities: any[],
    title: string,
    isRequired: boolean
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {isRequired && <Text style={styles.requiredBadge}>Required</Text>}
      </View>
      <View style={styles.amenitiesGrid}>
        {amenities.map((amenity) => (
          <Chip
            key={amenity.id}
            label={`${amenity.icon} ${amenity.label}`}
            selected={data.amenities.includes(amenity.id)}
            onPress={() => handleAmenityToggle(amenity.id)}
            variant="primary"
            style={styles.amenityChip}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amenities</Text>
      <Text style={styles.subtitle}>
        Select all amenities available in your property
      </Text>

      {renderAmenitiesSection(REQUIRED_AMENITIES, "Essential Amenities", true)}
      {renderAmenitiesSection(
        OPTIONAL_AMENITIES,
        "Additional Amenities",
        false
      )}

      {data.amenities.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedLabel}>
            Selected: {data.amenities.length} amenities
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[800],
    fontWeight: "600",
  },
  requiredBadge: {
    ...textStyles.caption,
    color: colors.error[600],
    backgroundColor: colors.error[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  amenityChip: {
    marginBottom: spacing.sm,
  },
  selectedContainer: {
    padding: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  selectedLabel: {
    ...textStyles.caption,
    color: colors.primary[700],
    fontWeight: "600",
    textAlign: "center",
  },
});
