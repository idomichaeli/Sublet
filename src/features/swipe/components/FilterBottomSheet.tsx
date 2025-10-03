import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
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
import DualRangeSlider from "../../../shared/components/ui/DualRangeSlider";
import Input from "../../../shared/components/ui/Input";
import { FilterData, FilterStepProps } from "../types/FilterData";
import {
  REQUIRED_AMENITIES,
  ADDITIONAL_AMENITIES,
} from "../../../core/types/propertyObjects";
import {
  ALL_ROOMS,
  BEDROOM_COUNTS,
  BATHROOM_COUNTS,
  RENOVATION_STATUSES,
  getRenovationLabel,
} from "../../../core/types/propertyObjects/PropertyBasicDetailsObject";

const { height: screenHeight } = Dimensions.get("window");

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

const TABS = [
  { id: "basic", label: "Basic Details", icon: "🏠" },
  { id: "amenities", label: "Amenities", icon: "✨" },
  { id: "price", label: "Price & Location", icon: "💰" },
];

// Helper function to check if a tab has data
const getTabHasData = (tabId: string, filterData: FilterData): boolean => {
  switch (tabId) {
    case "basic":
      return !!(
        filterData.bedrooms?.length ||
        filterData.bathrooms ||
        filterData.hasLivingRoom !== undefined ||
        filterData.minSize ||
        filterData.maxSize ||
        (filterData.renovation && filterData.renovation !== "any") ||
        filterData.additionalRooms?.length
      );
    case "amenities":
      return !!filterData.amenities?.length;
    case "price":
      return !!(
        filterData.minPrice ||
        filterData.maxPrice ||
        (filterData.propertyType && filterData.propertyType !== "any")
      );
    default:
      return false;
  }
};

// Basic Details Step Component
function BasicDetailsStep({ data, onUpdate }: FilterStepProps) {
  const [sizeRange, setSizeRange] = useState({
    min: data.minSize || 30,
    max: data.maxSize || 500,
  });

  useEffect(() => {
    setSizeRange({
      min: data.minSize || 30,
      max: data.maxSize || 500,
    });
  }, [data.minSize, data.maxSize]);

  const handleSizeRangeChange = (min: number, max: number) => {
    setSizeRange({ min, max });
    onUpdate({
      minSize: min !== 30 ? min : undefined,
      maxSize: max !== 500 ? max : undefined,
    });
  };

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

  const handleBedroomToggle = (bedroomCount: number) => {
    const currentBedrooms = data.bedrooms || [];
    if (currentBedrooms.includes(bedroomCount)) {
      // Remove from selection
      const newSelection = currentBedrooms.filter(
        (count) => count !== bedroomCount
      );
      onUpdate({
        bedrooms: newSelection.length > 0 ? newSelection : undefined,
      });
    } else {
      // Add to selection
      onUpdate({ bedrooms: [...currentBedrooms, bedroomCount] });
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
            selected={!data.bedrooms || data.bedrooms.length === 0}
            onPress={() => onUpdate({ bedrooms: undefined })}
            variant="primary"
          />
          {BEDROOM_COUNTS.map((count) => (
            <Chip
              key={count}
              label={count === 6 ? "6+" : count.toString()}
              selected={data.bedrooms?.includes(count) || false}
              onPress={() => handleBedroomToggle(count)}
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
          {BATHROOM_COUNTS.map((count) => (
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
        <DualRangeSlider
          label="Size Range"
          minValue={sizeRange.min}
          maxValue={sizeRange.max}
          onRangeChange={handleSizeRangeChange}
          minimumRange={30}
          maximumRange={500}
          step={10}
          unit="m²"
        />
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
          {RENOVATION_STATUSES.map((status) => (
            <Chip
              key={status.id}
              label={status.label}
              selected={data.renovation === status.id}
              onPress={() => onUpdate({ renovation: status.id })}
              variant="primary"
            />
          ))}
        </View>
      </View>

      {/* Additional Rooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Additional Rooms</Text>
        <Text style={styles.inputSubtext}>Select rooms you'd like to have</Text>
        <View style={styles.roomOptionsContainer}>
          {ALL_ROOMS.map((room) => (
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
        ADDITIONAL_AMENITIES,
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
  const [priceRange, setPriceRange] = useState({
    min: data.minPrice || 1000,
    max: data.maxPrice || 5000,
  });

  useEffect(() => {
    setPriceRange({
      min: data.minPrice || 1000,
      max: data.maxPrice || 5000,
    });
  }, [data.minPrice, data.maxPrice]);

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    onUpdate({
      minPrice: min !== 1000 ? min : undefined,
      maxPrice: max !== 5000 ? max : undefined,
    });
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Price & Location</Text>
      <Text style={styles.stepSubtitle}>
        Set your budget and preferred areas
      </Text>

      {/* Price Range */}
      <View style={styles.inputGroup}>
        <DualRangeSlider
          label="Monthly Rent Range"
          minValue={priceRange.min}
          maxValue={priceRange.max}
          onRangeChange={handlePriceRangeChange}
          minimumRange={500}
          maximumRange={10000}
          step={50}
          unit="₪"
        />
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

// Summary Review Modal Component
function SummaryReviewModal({
  visible,
  filterData,
  onClose,
  onConfirmApply,
}: {
  visible: boolean;
  filterData: FilterData;
  onClose: () => void;
  onConfirmApply: () => void;
}) {
  const getSelectedCount = () => {
    let count = 0;
    if (filterData.propertyType && filterData.propertyType !== "any") count++;
    if (filterData.bedrooms && filterData.bedrooms.length > 0) count++;
    if (filterData.bathrooms && filterData.bathrooms !== 3) count++;
    if (filterData.hasLivingRoom !== undefined) count++;
    if (filterData.minSize || filterData.maxSize) count++;
    if (filterData.renovation && filterData.renovation !== "any") count++;
    if (filterData.additionalRooms && filterData.additionalRooms.length > 0)
      count++;
    if (filterData.amenities && filterData.amenities.length > 0) count++;
    if (filterData.minPrice || filterData.maxPrice) count++;
    return count;
  };

  const renderFilterItems = () => {
    const items = [];

    if (filterData.propertyType && filterData.propertyType !== "any") {
      const typeLabels = {
        entire_place: "🏠 Entire Place",
        room: "🚪 Private Room",
        shared_room: "👥 Shared Room",
      };
      items.push(
        <View key="propertyType" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>Property Type</Text>
          <Text style={styles.reviewFilterValue}>
            {typeLabels[filterData.propertyType]}
          </Text>
        </View>
      );
    }

    if (filterData.bedrooms && filterData.bedrooms.length > 0) {
      const bedroomLabels = filterData.bedrooms.map((count) =>
        count === 6 ? "6+" : count.toString()
      );
      items.push(
        <View key="bedrooms" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>🛏️ Bedrooms</Text>
          <Text style={styles.reviewFilterValue}>
            {bedroomLabels.join(", ")}
          </Text>
        </View>
      );
    }

    if (filterData.bathrooms && filterData.bathrooms !== 3) {
      items.push(
        <View key="bathrooms" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>🚿 Bathrooms</Text>
          <Text style={styles.reviewFilterValue}>
            {filterData.bathrooms === 3 ? "3+" : filterData.bathrooms}
          </Text>
        </View>
      );
    }

    if (filterData.hasLivingRoom !== undefined) {
      items.push(
        <View key="livingRoom" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>🏡 Living Room</Text>
          <Text style={styles.reviewFilterValue}>
            {filterData.hasLivingRoom ? "Required" : "Not Required"}
          </Text>
        </View>
      );
    }

    if (filterData.minSize || filterData.maxSize) {
      const sizeRange = `${filterData.minSize || 30} - ${
        filterData.maxSize || 500
      } m²`;
      items.push(
        <View key="size" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>📏 Size Range</Text>
          <Text style={styles.reviewFilterValue}>{sizeRange}</Text>
        </View>
      );
    }

    if (filterData.renovation && filterData.renovation !== "any") {
      const renovationLabels: { [key: string]: string } = {
        renovated: "✨ Renovated",
        needs_work: "🔧 Needs Work",
        new: "✨ Brand New",
      };
      items.push(
        <View key="renovation" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>🏗️ Condition</Text>
          <Text style={styles.reviewFilterValue}>
            {renovationLabels[filterData.renovation] || filterData.renovation}
          </Text>
        </View>
      );
    }

    if (filterData.additionalRooms && filterData.additionalRooms.length > 0) {
      items.push(
        <View key="additionalRooms" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>🏢 Additional Rooms</Text>
          <Text style={styles.reviewFilterValue}>
            {filterData.additionalRooms.length} room
            {filterData.additionalRooms.length !== 1 ? "s" : ""}
          </Text>
        </View>
      );
    }

    if (filterData.amenities && filterData.amenities.length > 0) {
      items.push(
        <View key="amenities" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>✨ Amenities</Text>
          <Text style={styles.reviewFilterValue}>
            {filterData.amenities.length} amenit
            {filterData.amenities.length !== 1 ? "ies" : "y"}
          </Text>
        </View>
      );
    }

    if (filterData.minPrice || filterData.maxPrice) {
      const priceRange = `₪${filterData.minPrice || 500} - ₪${
        filterData.maxPrice || 10000
      }`;
      items.push(
        <View key="price" style={styles.reviewFilterItem}>
          <Text style={styles.reviewFilterLabel}>💰 Monthly Budget</Text>
          <Text style={styles.reviewFilterValue}>{priceRange}</Text>
        </View>
      );
    }

    return items;
  };

  const items = renderFilterItems() || [];

  return (
    <Modal visible={!!visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>📋 Filter Summary</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Info */}
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryCount}>
              {getSelectedCount()} filter{getSelectedCount() !== 1 ? "s" : ""}{" "}
              applied
            </Text>
            <Text style={styles.summarySubtext}>
              Ready to search with your preferences
            </Text>
          </View>

          {/* Filter Details */}
          <ScrollView
            style={styles.summaryScroll}
            showsVerticalScrollIndicator={false}
          >
            {items.length > 0 ? (
              <View style={styles.summaryFiltersList}>
                {items.map((item, index) => (
                  <View key={index} style={{ marginBottom: spacing.sm }}>
                    {item}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.summaryEmptyState}>
                <Text style={styles.summaryEmptyIcon}>🔍</Text>
                <Text style={styles.summaryEmptyTitle}>No Filters Applied</Text>
                <Text style={styles.summaryEmptyText}>
                  All available properties will be shown
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="secondary"
              style={styles.modalButton}
            />
            <View style={{ width: spacing.md }} />
            <Button
              title="Apply Filters"
              onPress={onConfirmApply}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function FilterBottomSheet({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}: FilterBottomSheetProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [filterData, setFilterData] = useState<FilterData>(initialFilters);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [tabAnimation] = useState(new Animated.Value(0));

  const updateData = (updates: Partial<FilterData>) => {
    setFilterData((prev) => ({ ...prev, ...updates }));
  };

  const handleApply = () => {
    setShowSummaryModal(true);
  };

  const handleConfirmApply = () => {
    onApply(filterData);
    onClose();
  };

  const handleReset = () => {
    setFilterData({});
    setActiveTab("basic");
  };

  const handleTabChange = (tabId: string) => {
    Animated.sequence([
      Animated.timing(tabAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tabAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicDetailsStep data={filterData} onUpdate={updateData} />;
      case "amenities":
        return <AmenitiesStep data={filterData} onUpdate={updateData} />;
      case "price":
        return <PriceLocationStep data={filterData} onUpdate={updateData} />;
      default:
        return <BasicDetailsStep data={filterData} onUpdate={updateData} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
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

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {TABS.map((tab) => {
            const hasData = getTabHasData(tab.id, filterData);
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  activeTab === tab.id && styles.tabActive,
                  hasData && styles.tabHasData,
                ]}
                onPress={() => handleTabChange(tab.id)}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  <Text
                    style={[
                      styles.tabIcon,
                      activeTab === tab.id && styles.tabIconActive,
                      hasData && styles.tabIconHasData,
                    ]}
                  >
                    {tab.icon}
                  </Text>
                  <Text
                    style={[
                      styles.tabLabel,
                      activeTab === tab.id && styles.tabLabelActive,
                      hasData && styles.tabLabelHasData,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {hasData && <View style={styles.tabDataIndicator} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Apply Filters"
            onPress={handleApply}
            variant="primary"
            size="lg"
            style={styles.applyButton}
          />
        </View>

        {/* Summary Review Modal */}
        <SummaryReviewModal
          visible={showSummaryModal}
          filterData={filterData}
          onClose={() => setShowSummaryModal(false)}
          onConfirmApply={handleConfirmApply}
        />
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    borderBottomWidth: 0,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  tabActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[300],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: spacing.xs,
    opacity: 0.7,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  tabLabelActive: {
    color: colors.primary[700],
    fontWeight: "600",
  },
  tabHasData: {
    backgroundColor: colors.success[50],
    borderColor: colors.success[200],
  },
  tabContent: {
    alignItems: "center",
    position: "relative",
  },
  tabIconHasData: {
    color: colors.success[600],
  },
  tabLabelHasData: {
    color: colors.success[700],
  },
  tabDataIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success[500],
    borderWidth: 1,
    borderColor: colors.neutral[0],
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
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  applyButton: {
    width: "100%",
    minHeight: 48,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    width: "100%",
    maxHeight: "80%",
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  modalTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  modalCloseButton: {
    padding: spacing.sm,
  },
  modalCloseIcon: {
    fontSize: 18,
    color: colors.neutral[600],
    fontWeight: "600",
  },
  summaryHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.primary[100],
  },
  summaryCount: {
    ...textStyles.h3,
    color: colors.primary[700],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  summarySubtext: {
    ...textStyles.body,
    color: colors.primary[600],
  },
  summaryScroll: {
    maxHeight: 300,
  },
  summaryFiltersList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryEmptyState: {
    padding: spacing.xl,
    alignItems: "center",
  },
  summaryEmptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  summaryEmptyTitle: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },
  summaryEmptyText: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  modalButton: {
    flex: 1,
  },
  // Review filter item styles for modal
  reviewFilterItem: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  reviewFilterLabel: {
    ...textStyles.body,
    fontWeight: "600",
    color: colors.primary[700],
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  reviewFilterValue: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "500",
    fontSize: 15,
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
});
