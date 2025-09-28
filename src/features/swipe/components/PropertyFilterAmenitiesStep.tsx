import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";
import Chip from "../../../shared/components/ui/Chip";
import { FilterData, FilterStepProps } from "../types/PropertyFilterData";

// Amenities list
const AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Heating",
  "Kitchen",
  "Washing Machine",
  "Dryer",
  "Dishwasher",
  "Microwave",
  "Refrigerator",
  "Oven",
  "Stove",
  "Coffee Maker",
  "Toaster",
  "Blender",
  "Iron",
  "Hair Dryer",
  "TV",
  "Cable TV",
  "Netflix",
  "Sound System",
  "Gaming Console",
  "Workspace",
  "Desk",
  "Chair",
  "Books",
  "Board Games",
  "Piano",
  "Guitar",
  "Balcony",
  "Terrace",
  "Garden",
  "Patio",
  "BBQ",
  "Fireplace",
  "Pool",
  "Hot Tub",
  "Sauna",
  "Gym",
  "Tennis Court",
  "Basketball Court",
  "Parking",
  "Garage",
  "Elevator",
  "Security",
  "Concierge",
  "Doorman",
  "Pet Friendly",
  "Smoking Allowed",
  "Wheelchair Accessible",
  "Long Term Stays",
  "Short Term Stays",
  "Events Allowed",
  "Parties Allowed",
];

export default function PropertyFilterAmenitiesStep({
  data,
  onUpdate,
}: FilterStepProps) {
  const toggleAmenity = (amenity: string) => {
    const currentAmenities = data.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];
    onUpdate({ amenities: newAmenities });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Amenities</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the amenities that are important to you
        </Text>

        <View style={styles.amenitiesContainer}>
          {AMENITIES.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              selected={data.amenities?.includes(amenity) || false}
              onPress={() => toggleAmenity(amenity)}
              variant="secondary"
              style={styles.amenityChip}
            />
          ))}
        </View>

        {data.amenities && data.amenities.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>Selected Amenities:</Text>
            <View style={styles.selectedChips}>
              {data.amenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  selected={true}
                  onPress={() => toggleAmenity(amenity)}
                  variant="primary"
                  style={styles.selectedChip}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.lg,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  amenityChip: {
    marginBottom: spacing.sm,
  },
  selectedContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  selectedTitle: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  selectedChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  selectedChip: {
    marginBottom: spacing.sm,
  },
});
