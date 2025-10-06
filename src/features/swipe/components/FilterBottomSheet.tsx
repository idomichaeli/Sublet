import React, { useState, useEffect, useCallback, useMemo } from "react";
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

// Core imports
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

// Component imports
import Button from "../../../shared/components/ui/Button";
import Chip from "../../../shared/components/ui/Chip";
import Toggle from "../../../shared/components/ui/Toggle";
import DualRangeSlider from "../../../shared/components/ui/DualRangeSlider";

// Type imports
import { FilterData, FilterStepProps } from "../types/FilterData";

// Data imports
import {
  REQUIRED_AMENITIES,
  ADDITIONAL_AMENITIES,
} from "../../../core/types/propertyObjects";
import {
  ALL_ROOMS,
  BEDROOM_COUNTS,
  BATHROOM_COUNTS,
  RENOVATION_STATUSES,
} from "../../../core/types/propertyObjects/PropertyBasicDetailsObject";

// Constants
const { height: screenHeight } = Dimensions.get("window");

// Types
interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

interface RangeState {
  min: number;
  max: number;
}

interface SummaryReviewModalProps {
  visible: boolean;
  filterData: FilterData;
  onClose: () => void;
  onConfirmApply: () => void;
}

// Constants
const TABS: TabConfig[] = [
  { id: "basic", label: "Basic Details", icon: "🏠" },
  { id: "amenities", label: "Amenities", icon: "✨" },
  { id: "price", label: "Price & Location", icon: "💰" },
];

const DEFAULT_SIZE_RANGE: RangeState = { min: 30, max: 500 };
const DEFAULT_PRICE_RANGE: RangeState = { min: 1000, max: 5000 };

/**
 * Helper function to check if a tab has active filter data
 */
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

/**
 * Basic Details Step Component
 * Handles bedrooms, bathrooms, living room, size, renovation, and additional rooms
 */
function BasicDetailsStep({ data, onUpdate }: FilterStepProps) {
  const [sizeRange, setSizeRange] = useState<RangeState>({
    min: data.minSize || DEFAULT_SIZE_RANGE.min,
    max: data.maxSize || DEFAULT_SIZE_RANGE.max,
  });

  // Update size range when data changes
  useEffect(() => {
    setSizeRange({
      min: data.minSize || DEFAULT_SIZE_RANGE.min,
      max: data.maxSize || DEFAULT_SIZE_RANGE.max,
    });
  }, [data.minSize, data.maxSize]);

  /**
   * Handles size range changes
   */
  const handleSizeRangeChange = useCallback(
    (min: number, max: number) => {
      setSizeRange({ min, max });
      onUpdate({
        minSize: min !== DEFAULT_SIZE_RANGE.min ? min : undefined,
        maxSize: max !== DEFAULT_SIZE_RANGE.max ? max : undefined,
      });
    },
    [onUpdate]
  );

  /**
   * Handles additional room toggle
   */
  const handleRoomToggle = useCallback(
    (room: string, isSelected: boolean) => {
      const currentRooms = data.additionalRooms || [];
      if (isSelected) {
        if (!currentRooms.includes(room)) {
          onUpdate({ additionalRooms: [...currentRooms, room] });
        }
      } else {
        onUpdate({ additionalRooms: currentRooms.filter((r) => r !== room) });
      }
    },
    [data.additionalRooms, onUpdate]
  );

  /**
   * Handles bedroom count toggle
   */
  const handleBedroomToggle = useCallback(
    (bedroomCount: number) => {
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
    },
    [data.bedrooms, onUpdate]
  );

  /**
   * Renders bedroom selection chips
   */
  const renderBedroomChips = useCallback(
    () => (
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
    ),
    [data.bedrooms, handleBedroomToggle, onUpdate]
  );

  /**
   * Renders living room selection chips
   */
  const renderLivingRoomChips = useCallback(
    () => (
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
    ),
    [data.hasLivingRoom, onUpdate]
  );

  /**
   * Renders bathroom selection chips
   */
  const renderBathroomChips = useCallback(
    () => (
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
    ),
    [data.bathrooms, onUpdate]
  );

  /**
   * Renders renovation status chips
   */
  const renderRenovationChips = useCallback(
    () => (
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
    ),
    [data.renovation, onUpdate]
  );

  /**
   * Renders additional rooms toggles
   */
  const renderAdditionalRooms = useCallback(
    () => (
      <View style={styles.roomOptionsContainer}>
        {ALL_ROOMS.map((room) => (
          <View key={room} style={styles.roomOption}>
            <Toggle
              value={data.additionalRooms?.includes(room) || false}
              onValueChange={(isSelected) => handleRoomToggle(room, isSelected)}
              size="sm"
            />
            <Text style={styles.roomOptionLabel}>{room}</Text>
          </View>
        ))}
      </View>
    ),
    [data.additionalRooms, handleRoomToggle]
  );

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Details</Text>
      <Text style={styles.stepSubtitle}>What are your basic requirements?</Text>

      {/* Bedrooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bedrooms</Text>
        {renderBedroomChips()}
      </View>

      {/* Living Room */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Living Room</Text>
        {renderLivingRoomChips()}
      </View>

      {/* Bathrooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bathrooms</Text>
        {renderBathroomChips()}
      </View>

      {/* Size Range */}
      <View style={styles.inputGroup}>
        <DualRangeSlider
          label="Size Range"
          minValue={sizeRange.min}
          maxValue={sizeRange.max}
          onRangeChange={handleSizeRangeChange}
          minimumRange={DEFAULT_SIZE_RANGE.min}
          maximumRange={DEFAULT_SIZE_RANGE.max}
          step={10}
          unit="m²"
        />
      </View>

      {/* Renovation Status */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Renovation Status</Text>
        {renderRenovationChips()}
      </View>

      {/* Additional Rooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Additional Rooms</Text>
        <Text style={styles.inputSubtext}>Select rooms you'd like to have</Text>
        {renderAdditionalRooms()}
      </View>
    </View>
  );
}

/**
 * Amenities Step Component
 * Handles essential and additional amenities selection
 */
function AmenitiesStep({ data, onUpdate }: FilterStepProps) {
  /**
   * Handles amenity toggle
   */
  const handleAmenityToggle = useCallback(
    (amenityId: string) => {
      const newAmenities = data.amenities?.includes(amenityId)
        ? data.amenities.filter((id) => id !== amenityId)
        : [...(data.amenities || []), amenityId];
      onUpdate({ amenities: newAmenities });
    },
    [data.amenities, onUpdate]
  );

  /**
   * Renders amenities section
   */
  const renderAmenitiesSection = useCallback(
    (amenities: any[], title: string, isRequired: boolean) => (
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
    ),
    [data.amenities, handleAmenityToggle]
  );

  /**
   * Renders selected amenities summary
   */
  const renderSelectedSummary = useCallback(() => {
    if (!data.amenities || data.amenities.length === 0) return null;

    return (
      <View style={styles.selectedContainer}>
        <Text style={styles.selectedLabel}>
          Selected: {data.amenities.length} amenities
        </Text>
      </View>
    );
  }, [data.amenities]);

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

      {renderSelectedSummary()}
    </View>
  );
}

/**
 * Price & Location Step Component
 * Handles price range and property type selection
 */
function PriceLocationStep({ data, onUpdate }: FilterStepProps) {
  const [priceRange, setPriceRange] = useState<RangeState>({
    min: data.minPrice || DEFAULT_PRICE_RANGE.min,
    max: data.maxPrice || DEFAULT_PRICE_RANGE.max,
  });

  // Update price range when data changes
  useEffect(() => {
    setPriceRange({
      min: data.minPrice || DEFAULT_PRICE_RANGE.min,
      max: data.maxPrice || DEFAULT_PRICE_RANGE.max,
    });
  }, [data.minPrice, data.maxPrice]);

  /**
   * Handles price range changes
   */
  const handlePriceRangeChange = useCallback(
    (min: number, max: number) => {
      setPriceRange({ min, max });
      onUpdate({
        minPrice: min !== DEFAULT_PRICE_RANGE.min ? min : undefined,
        maxPrice: max !== DEFAULT_PRICE_RANGE.max ? max : undefined,
      });
    },
    [onUpdate]
  );

  /**
   * Renders property type chips
   */
  const renderPropertyTypeChips = useCallback(
    () => (
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
    ),
    [data.propertyType, onUpdate]
  );

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
        {renderPropertyTypeChips()}
      </View>

      {/* Location Note */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Preferred Areas</Text>
        <Text style={styles.inputSubtext}>
          Location filtering will be available soon. For now, browse all areas.
        </Text>
      </View>
    </View>
  );
}

/**
 * Summary Review Modal Component
 * Shows a summary of applied filters before confirmation
 */
function SummaryReviewModal({
  visible,
  filterData,
  onClose,
  onConfirmApply,
}: SummaryReviewModalProps) {
  /**
   * Counts the number of active filters
   */
  const getSelectedCount = useCallback(() => {
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
  }, [filterData]);

  /**
   * Renders filter items for the summary
   */
  const renderFilterItems = useCallback(() => {
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
  }, [filterData]);

  /**
   * Renders empty state when no filters are applied
   */
  const renderEmptyState = useCallback(
    () => (
      <View style={styles.summaryEmptyState}>
        <Text style={styles.summaryEmptyIcon}>🔍</Text>
        <Text style={styles.summaryEmptyTitle}>No Filters Applied</Text>
        <Text style={styles.summaryEmptyText}>
          All available properties will be shown
        </Text>
      </View>
    ),
    []
  );

  const selectedCount = getSelectedCount();
  const filterItems = renderFilterItems();

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
              {selectedCount} filter{selectedCount !== 1 ? "s" : ""} applied
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
            {filterItems.length > 0 ? (
              <View style={styles.summaryFiltersList}>
                {filterItems.map((item, index) => (
                  <View key={index} style={{ marginBottom: spacing.sm }}>
                    {item}
                  </View>
                ))}
              </View>
            ) : (
              renderEmptyState()
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

/**
 * Main FilterBottomSheet Component
 * Provides a comprehensive filtering interface with tabbed navigation
 */
export default function FilterBottomSheet({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}: FilterBottomSheetProps) {
  // State
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [filterData, setFilterData] = useState<FilterData>(initialFilters);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [tabAnimation] = useState(new Animated.Value(0));

  // Update filter data when initial filters change
  useEffect(() => {
    setFilterData(initialFilters);
  }, [initialFilters]);

  /**
   * Updates filter data with new values
   */
  const updateData = useCallback((updates: Partial<FilterData>) => {
    setFilterData((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Handles apply button press - shows summary modal
   */
  const handleApply = useCallback(() => {
    setShowSummaryModal(true);
  }, []);

  /**
   * Handles confirmation of filter application
   */
  const handleConfirmApply = useCallback(() => {
    onApply(filterData);
    onClose();
  }, [filterData, onApply, onClose]);

  /**
   * Handles reset button press
   */
  const handleReset = useCallback(() => {
    setFilterData({});
    setActiveTab("basic");
  }, []);

  /**
   * Handles tab change with animation
   */
  const handleTabChange = useCallback(
    (tabId: string) => {
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
    },
    [tabAnimation]
  );

  /**
   * Renders tab content based on active tab
   */
  const renderTabContent = useCallback(() => {
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
  }, [activeTab, filterData, updateData]);

  /**
   * Renders tab navigation
   */
  const renderTabNavigation = useCallback(
    () => (
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
    ),
    [activeTab, filterData, handleTabChange]
  );

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
        {renderTabNavigation()}

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
