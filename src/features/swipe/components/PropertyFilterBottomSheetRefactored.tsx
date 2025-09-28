import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
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
import PropertyFilterBasicDetailsStep from "./PropertyFilterBasicDetailsStep";
import PropertyFilterAmenitiesStep from "./PropertyFilterAmenitiesStep";
import PropertyFilterPriceLocationStep from "./PropertyFilterPriceLocationStep";
import PropertyFilterReviewStep from "./PropertyFilterReviewStep";
import { FilterData } from "../types/PropertyFilterData";

const { height: screenHeight } = Dimensions.get("window");

interface PropertyFilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

const STEPS = ["Basic Details", "Amenities", "Price & Location", "Review"];

export default function PropertyFilterBottomSheet({
  visible,
  onClose,
  onApply,
  initialFilters,
}: PropertyFilterBottomSheetProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [filters, setFilters] = useState<FilterData>(initialFilters || {});

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
    setCurrentStep(0);
  };

  const updateFilters = (updates: Partial<FilterData>) => {
    setFilters({ ...filters, ...updates });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyFilterBasicDetailsStep
            data={filters}
            onUpdate={updateFilters}
          />
        );
      case 1:
        return (
          <PropertyFilterAmenitiesStep
            data={filters}
            onUpdate={updateFilters}
          />
        );
      case 2:
        return (
          <PropertyFilterPriceLocationStep
            data={filters}
            onUpdate={updateFilters}
          />
        );
      case 3:
        return (
          <PropertyFilterReviewStep data={filters} onUpdate={updateFilters} />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
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
            {STEPS.map((step, index) => (
              <View key={index} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressDot,
                    index <= currentStep && styles.progressDotActive,
                  ]}
                />
                <Text
                  style={[
                    styles.progressLabel,
                    index <= currentStep && styles.progressLabelActive,
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>{renderStep()}</View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            {currentStep > 0 && (
              <Button
                title="Previous"
                onPress={handlePrevious}
                variant="secondary"
                style={styles.footerButton}
              />
            )}
            <View style={styles.spacer} />
            {currentStep < STEPS.length - 1 ? (
              <Button
                title="Next"
                onPress={handleNext}
                style={styles.footerButton}
              />
            ) : (
              <Button
                title="Apply Filters"
                onPress={handleApply}
                style={styles.footerButton}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[0],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
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
    fontWeight: "600",
    color: colors.neutral[800],
  },
  resetButton: {
    padding: spacing.sm,
  },
  resetButtonText: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral[300],
    marginBottom: spacing.xs,
  },
  progressDotActive: {
    backgroundColor: colors.primary[500],
  },
  progressLabel: {
    ...textStyles.caption,
    color: colors.neutral[500],
    textAlign: "center",
  },
  progressLabelActive: {
    color: colors.primary[600],
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  footerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerButton: {
    flex: 1,
  },
  spacer: {
    width: spacing.md,
  },
});
