import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";
import Button from "../../../shared/components/ui/Button";
import Chip from "../../../shared/components/ui/Chip";
import Toggle from "../../../shared/components/ui/Toggle";
import SizeInput from "../../../shared/components/ui/SizeInput";
import Input from "../../../shared/components/ui/Input";
import { FilterData, FilterStepProps } from "../types/FilterData";

const { height: screenHeight } = Dimensions.get("window");

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

const STEPS = ["Basic Details", "Amenities", "Price & Location", "Review"];

// Additional room options (same as in add property)
const ADDITIONAL_ROOMS = [
  "Dining room",
  "Kitchen",
  "Pantry",
  "Office room",
  "Balcony",
  "Garage",
  "Closet room",
  "Garden/Yard",
  "Outdoor Kitchen",
];

// Amenities (same as in add property)
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

// Basic Details Step Component
function BasicDetailsStep({ data, onUpdate }: FilterStepProps) {
  const handleRoomToggle = (room: string, isSelected: boolean) => {
    const currentRooms = data.additionalRooms || [];
    if (isSelected) {
      if (!currentRooms.includes(room)) {
        onUpdate({ additionalRooms: [...currentRooms, room] });
      }
    } else {
      onUpdate({ additionalRooms: currentRooms.filter((r) => r !== room) });
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Details</Text>
      <Text style={styles.stepSubtitle}>What are your basic requirements?</Text>

      {/* Bedrooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bedrooms</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.bedrooms}
            onPress={() => onUpdate({ bedrooms: undefined })}
            variant="primary"
          />
          {[1, 2, 3, 4].map((count) => (
            <Chip
              key={count}
              label={count === 4 ? "4+" : count.toString()}
              selected={data.bedrooms === count}
              onPress={() => onUpdate({ bedrooms: count })}
              variant="primary"
            />
          ))}
        </View>
      </View>

      {/* Living Room */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Living Room</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={data.hasLivingRoom === undefined}
            onPress={() => onUpdate({ hasLivingRoom: undefined })}
            variant="primary"
          />
          <Chip
            label="Required"
            selected={data.hasLivingRoom === true}
            onPress={() => onUpdate({ hasLivingRoom: true })}
            variant="primary"
          />
          <Chip
            label="Not Required"
            selected={data.hasLivingRoom === false}
            onPress={() => onUpdate({ hasLivingRoom: false })}
            variant="primary"
          />
        </View>
      </View>

      {/* Bathrooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bathrooms</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.bathrooms}
            onPress={() => onUpdate({ bathrooms: undefined })}
            variant="primary"
          />
          {[1, 2, 3].map((count) => (
            <Chip
              key={count}
              label={count === 3 ? "3+" : count.toString()}
              selected={data.bathrooms === count}
              onPress={() => onUpdate({ bathrooms: count })}
              variant="primary"
            />
          ))}
        </View>
      </View>

      {/* Size Range */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Size Range (m²)</Text>
        <View style={styles.sizeRangeContainer}>
          <View style={styles.sizeInputContainer}>
            <Input
              label="Min Size"
              placeholder="30"
              value={data.minSize?.toString() || ""}
              onChangeText={(text) =>
                onUpdate({ minSize: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              style={styles.sizeInput}
            />
          </View>
          <Text style={styles.sizeRangeSeparator}>to</Text>
          <View style={styles.sizeInputContainer}>
            <Input
              label="Max Size"
              placeholder="500"
              value={data.maxSize?.toString() || ""}
              onChangeText={(text) =>
                onUpdate({ maxSize: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              style={styles.sizeInput}
            />
          </View>
        </View>
      </View>

      {/* Renovation Status */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Renovation Status</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.renovation || data.renovation === "any"}
            onPress={() => onUpdate({ renovation: "any" })}
            variant="primary"
          />
          <Chip
            label="✨ New"
            selected={data.renovation === "new"}
            onPress={() => onUpdate({ renovation: "new" })}
            variant="primary"
          />
          <Chip
            label="🛠️ Renovated"
            selected={data.renovation === "renovated"}
            onPress={() => onUpdate({ renovation: "renovated" })}
            variant="primary"
          />
          <Chip
            label="🏚️ Needs work"
            selected={data.renovation === "needs_work"}
            onPress={() => onUpdate({ renovation: "needs_work" })}
            variant="primary"
          />
        </View>
      </View>

      {/* Additional Rooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Additional Rooms</Text>
        <Text style={styles.inputSubtext}>Select rooms you'd like to have</Text>
        <View style={styles.roomOptionsContainer}>
          {ADDITIONAL_ROOMS.map((room) => (
            <View key={room} style={styles.roomOption}>
              <Toggle
                value={data.additionalRooms?.includes(room) || false}
                onValueChange={(isSelected) =>
                  handleRoomToggle(room, isSelected)
                }
                size="sm"
              />
              <Text style={styles.roomOptionLabel}>{room}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Amenities Step Component
function AmenitiesStep({ data, onUpdate }: FilterStepProps) {
  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = data.amenities?.includes(amenityId)
      ? data.amenities.filter((id) => id !== amenityId)
      : [...(data.amenities || []), amenityId];
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
            selected={data.amenities?.includes(amenity.id) || false}
            onPress={() => handleAmenityToggle(amenity.id)}
            variant="primary"
            style={styles.amenityChip}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Amenities</Text>
      <Text style={styles.stepSubtitle}>
        What amenities are important to you?
      </Text>

      {renderAmenitiesSection(REQUIRED_AMENITIES, "Essential Amenities", true)}
      {renderAmenitiesSection(
        OPTIONAL_AMENITIES,
        "Additional Amenities",
        false
      )}

      {data.amenities && data.amenities.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedLabel}>
            Selected: {data.amenities.length} amenities
          </Text>
        </View>
      )}
    </View>
  );
}

// Price & Location Step Component
function PriceLocationStep({ data, onUpdate }: FilterStepProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Price & Location</Text>
      <Text style={styles.stepSubtitle}>
        Set your budget and preferred areas
      </Text>

      {/* Price Range */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Monthly Rent Range (₪)</Text>
        <View style={styles.sizeRangeContainer}>
          <View style={styles.sizeInputContainer}>
            <Input
              label="Min Price"
              placeholder="1000"
              value={data.minPrice?.toString() || ""}
              onChangeText={(text) =>
                onUpdate({ minPrice: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              style={styles.sizeInput}
            />
          </View>
          <Text style={styles.sizeRangeSeparator}>to</Text>
          <View style={styles.sizeInputContainer}>
            <Input
              label="Max Price"
              placeholder="8000"
              value={data.maxPrice?.toString() || ""}
              onChangeText={(text) =>
                onUpdate({ maxPrice: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              style={styles.sizeInput}
            />
          </View>
        </View>
      </View>

      {/* Property Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Property Type</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.propertyType || data.propertyType === "any"}
            onPress={() => onUpdate({ propertyType: "any" })}
            variant="primary"
          />
          <Chip
            label="Entire Place"
            selected={data.propertyType === "entire_place"}
            onPress={() => onUpdate({ propertyType: "entire_place" })}
            variant="primary"
          />
          <Chip
            label="Room"
            selected={data.propertyType === "room"}
            onPress={() => onUpdate({ propertyType: "room" })}
            variant="primary"
          />
          <Chip
            label="Shared Room"
            selected={data.propertyType === "shared_room"}
            onPress={() => onUpdate({ propertyType: "shared_room" })}
            variant="primary"
          />
        </View>
      </View>

      {/* Note about location - could be expanded later */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Preferred Areas</Text>
        <Text style={styles.inputSubtext}>
          Location filtering will be available soon. For now, browse all areas.
        </Text>
      </View>
    </View>
  );
}

// Review Step Component
function ReviewStep({ data, onUpdate }: FilterStepProps) {
  const getFilterSummary = () => {
    const filters = [];

    if (data.bedrooms) {
      filters.push(
        `${data.bedrooms === 4 ? "4+" : data.bedrooms} bedroom${
          data.bedrooms > 1 ? "s" : ""
        }`
      );
    }

    if (data.bathrooms) {
      filters.push(
        `${data.bathrooms === 3 ? "3+" : data.bathrooms} bathroom${
          data.bathrooms > 1 ? "s" : ""
        }`
      );
    }

    if (data.hasLivingRoom === true) {
      filters.push("Living room required");
    } else if (data.hasLivingRoom === false) {
      filters.push("Living room not required");
    }

    if (data.minSize || data.maxSize) {
      const min = data.minSize || 0;
      const max = data.maxSize || "∞";
      filters.push(`Size: ${min}-${max} m²`);
    }

    if (data.renovation && data.renovation !== "any") {
      const renovationLabels = {
        new: "✨ New",
        renovated: "🛠️ Renovated",
        needs_work: "🏚️ Needs work",
      };
      filters.push(renovationLabels[data.renovation]);
    }

    if (data.additionalRooms && data.additionalRooms.length > 0) {
      filters.push(
        `${data.additionalRooms.length} additional room${
          data.additionalRooms.length > 1 ? "s" : ""
        }`
      );
    }

    if (data.amenities && data.amenities.length > 0) {
      filters.push(
        `${data.amenities.length} amenit${
          data.amenities.length > 1 ? "ies" : "y"
        }`
      );
    }

    if (data.minPrice || data.maxPrice) {
      const min = data.minPrice || 0;
      const max = data.maxPrice || "∞";
      filters.push(`Price: ₪${min}-${max}/month`);
    }

    if (data.propertyType && data.propertyType !== "any") {
      const typeLabels = {
        entire_place: "Entire Place",
        room: "Room",
        shared_room: "Shared Room",
      };
      filters.push(typeLabels[data.propertyType]);
    }

    return filters;
  };

  const filters = getFilterSummary();

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review Filters</Text>
      <Text style={styles.stepSubtitle}>Review your filter preferences</Text>

      <View style={styles.reviewContainer}>
        {filters.length > 0 ? (
          <View style={styles.filtersList}>
            {filters.map((filter, index) => (
              <View key={index} style={styles.filterItem}>
                <Text style={styles.filterText}>• {filter}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noFiltersText}>
            No filters applied. You'll see all available apartments.
          </Text>
        )}
      </View>
    </View>
  );
}

export default function FilterBottomSheet({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}: FilterBottomSheetProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [filterData, setFilterData] = useState<FilterData>(initialFilters);

  const updateData = (updates: Partial<FilterData>) => {
    setFilterData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApply = () => {
    onApply(filterData);
    onClose();
  };

  const handleReset = () => {
    setFilterData({});
    setCurrentStep(0);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicDetailsStep data={filterData} onUpdate={updateData} />;
      case 1:
        return <AmenitiesStep data={filterData} onUpdate={updateData} />;
      case 2:
        return <PriceLocationStep data={filterData} onUpdate={updateData} />;
      case 3:
        return <ReviewStep data={filterData} onUpdate={updateData} />;
      default:
        return <BasicDetailsStep data={filterData} onUpdate={updateData} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCurrentStep()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            {currentStep > 0 && (
              <Button
                title="Back"
                onPress={prevStep}
                variant="secondary"
                style={styles.footerButton}
              />
            )}
            <Button
              title={
                currentStep === STEPS.length - 1 ? "Apply Filters" : "Next"
              }
              onPress={
                currentStep === STEPS.length - 1 ? handleApply : nextStep
              }
              variant="primary"
              style={
                [
                  styles.footerButton,
                  currentStep === 0 && styles.footerButtonFull,
                ] as any
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
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
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  resetButton: {
    padding: spacing.sm,
  },
  resetButtonText: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral[300],
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: colors.primary[500],
  },
  progressText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  footerButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  footerButton: {
    flex: 1,
  },
  footerButtonFull: {
    flex: 1,
  },
  stepContainer: {
    paddingVertical: spacing.lg,
  },
  stepTitle: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  inputSubtext: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  sizeRangeContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
  },
  sizeInputContainer: {
    flex: 1,
  },
  sizeInput: {
    marginBottom: 0,
  },
  sizeRangeSeparator: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  roomOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  roomOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    minWidth: "45%",
  },
  roomOptionLabel: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginLeft: spacing.sm,
    flex: 1,
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
  reviewContainer: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  filtersList: {
    gap: spacing.sm,
  },
  filterItem: {
    paddingVertical: spacing.xs,
  },
  filterText: {
    ...textStyles.body,
    color: colors.neutral[700],
  },
  noFiltersText: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
    fontStyle: "italic",
  },
});
