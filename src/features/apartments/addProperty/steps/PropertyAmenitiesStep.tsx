import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
} from "../../../../shared/constants/tokens";
import Chip from "../../../../shared/components/ui/Chip";
import {
  PropertyAmenitiesObject,
  REQUIRED_AMENITIES,
  ADDITIONAL_AMENITIES,
  addAmenity,
  hasRequiredAmenity,
} from "../../../../core/types/propertyObjects";

interface StepProps {
  data: PropertyAmenitiesObject;
  onUpdate: (updates: Partial<PropertyAmenitiesObject>) => void;
}

export default function AmenitiesStep({ data, onUpdate }: StepProps) {
  const handleAmenityToggle = (amenityId: string) => {
    const updatedAmenities = addAmenity(data, amenityId);
    onUpdate({ amenities: updatedAmenities.amenities });
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
        ADDITIONAL_AMENITIES,
        "Additional Amenities",
        false
      )}

      {!hasRequiredAmenity(data) && (
        <View style={styles.requiredContainer}>
          <Text style={styles.requiredLabel}>
            ⚠️ Please select at least one amenity from the Essential Amenities
            section to continue
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
  requiredContainer: {
    padding: spacing.md,
    backgroundColor: colors.warning[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warning[200],
    marginTop: spacing.md,
  },
  requiredLabel: {
    ...textStyles.caption,
    color: colors.warning[700],
    fontWeight: "600",
    textAlign: "center",
  },
});
