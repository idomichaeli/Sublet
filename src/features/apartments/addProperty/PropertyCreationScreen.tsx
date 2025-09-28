import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
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
import AnimatedRoomCounter from "../../../shared/components/ui/AnimatedRoomCounter";
import ProgressIndicator from "./components/PropertyCreationProgressIndicator";
import PropertyTypeCategoryStep from "./steps/PropertyTypeCategoryStep";
import LocationStep from "./steps/PropertyLocationStep";
import BasicDetailsStep from "./steps/PropertyBasicDetailsStep";
import AmenitiesStep from "./steps/PropertyAmenitiesStep";
import PhotosStep from "./steps/PropertyPhotosStep";
import AvailabilityStep from "./steps/PropertyAvailabilityStep";
import PricingStep from "./steps/PropertyPricingStep";
import ReviewStep from "./steps/PropertyReviewStep";
import { PropertyData } from "./types/PropertyCreationData";

const STEPS = [
  "Property Category",
  "Location",
  "Basic Details",
  "Amenities",
  "Photos",
  "Availability",
  "Pricing",
  "Review & Publish",
];

export default function AddPropertyScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyData, setPropertyData] = useState<PropertyData>({
    // Property Category
    propertyCategory: undefined,

    // Property Type
    propertyType: undefined,

    // Contact Info
    name: "",
    email: "",
    phone: "",

    // Location
    location: undefined,
    area: undefined,
    street: "",
    streetNumber: "",
    floor: "",
    apartmentNumber: "",
    postcode: "",
    hasShelter: false,
    shelterLocation: undefined,
    shelterDistance: undefined,

    // Basic Details
    bedrooms: 1,
    customBedrooms: undefined,
    isOneBedroomLivingRoom: false,
    bathrooms: 1,
    customBathrooms: undefined,
    renovation: "new",
    size: 50,
    additionalRooms: [],

    // Amenities
    amenities: [],

    // Photos
    photos: [],

    // Availability
    availableFrom: undefined,
    availableTo: undefined,
    startDateFlexibility: undefined,
    endDateFlexibility: undefined,

    // Pricing
    price: 1200,
    pricingFrequency: "month",
  });

  // Helper function to calculate total rooms
  const calculateTotalRooms = () => {
    let totalRooms = 0;

    // Add bedrooms (use customBedrooms if available, otherwise use bedrooms)
    const bedroomCount = propertyData.customBedrooms || propertyData.bedrooms;
    totalRooms += bedroomCount;

    // Add living room if it exists (separate from bedrooms)
    if (propertyData.isOneBedroomLivingRoom) {
      totalRooms += 1;
    }

    // Additional rooms are no longer counted towards total room count
    // const countableRooms = ["Closet room"];
    // const countableAdditionalRooms =
    //   propertyData.additionalRooms?.filter((room) =>
    //     countableRooms.includes(room)
    //   ) || [];
    // totalRooms += countableAdditionalRooms.length;

    return totalRooms;
  };

  const updateData = (updates: Partial<PropertyData>) => {
    setPropertyData((prev) => ({ ...prev, ...updates }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Property Category Step
        return (
          propertyData.propertyCategory !== undefined &&
          propertyData.propertyType !== undefined
        );
      case 1: // Location Step
        return (
          propertyData.street.trim() !== "" &&
          propertyData.streetNumber.trim() !== "" &&
          propertyData.floor.trim() !== "" &&
          propertyData.apartmentNumber.trim() !== "" &&
          propertyData.postcode.trim() !== "" &&
          propertyData.area !== undefined &&
          (propertyData.hasShelter === false ||
            (propertyData.hasShelter === true &&
              propertyData.shelterLocation !== undefined &&
              (propertyData.shelterLocation !== "other" ||
                (propertyData.shelterLocation === "other" &&
                  propertyData.shelterDistance !== undefined))))
        );
      case 2: // Basic Details Step
        return (
          propertyData.bedrooms > 0 &&
          propertyData.bathrooms > 0 &&
          propertyData.size > 0 &&
          (propertyData.bedrooms !== 4 ||
            propertyData.customBedrooms !== undefined) &&
          (propertyData.bathrooms !== 3 ||
            propertyData.customBathrooms !== undefined)
        );
      case 3: // Amenities Step
        // At least one required amenity must be selected
        const requiredAmenityIds = [
          "wifi",
          "ac",
          "elevator",
          "furnished",
          "pet_friendly",
          "smoking_allowed",
          "accessible",
          "none",
        ];
        return propertyData.amenities.some((amenityId) =>
          requiredAmenityIds.includes(amenityId)
        );
      case 4: // Photos Step
        return propertyData.photos.length > 0;
      case 5: // Availability Step
        return (
          propertyData.availableFrom && propertyData.availableFrom.trim() !== ""
        );
      case 6: // Pricing Step
        return propertyData.price > 0;
      case 7: // Review Step
        return true; // Review step doesn't need validation
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      } else {
        Alert.alert(
          "Missing Information",
          "Please fill in all required fields before proceeding.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = () => {
    Alert.alert(
      "Draft Saved",
      "Your property listing has been saved as a draft.",
      [{ text: "OK" }]
    );
  };

  const publishProperty = () => {
    Alert.alert(
      "Property Published!",
      "Your property listing is now live and visible to renters.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PropertyTypeCategoryStep data={propertyData} onUpdate={updateData} />
        );
      case 1:
        return <LocationStep data={propertyData} onUpdate={updateData} />;
      case 2:
        return <BasicDetailsStep data={propertyData} onUpdate={updateData} />;
      case 3:
        return <AmenitiesStep data={propertyData} onUpdate={updateData} />;
      case 4:
        return <PhotosStep data={propertyData} onUpdate={updateData} />;
      case 5:
        return <AvailabilityStep data={propertyData} onUpdate={updateData} />;
      case 6:
        return <PricingStep data={propertyData} onUpdate={updateData} />;
      case 7:
        return <ReviewStep data={propertyData} onUpdate={updateData} />;
      default:
        return (
          <PropertyTypeCategoryStep data={propertyData} onUpdate={updateData} />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
        <TouchableOpacity style={styles.draftButton} onPress={saveDraft}>
          <Text style={styles.draftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Indicator with Property Icon and Rooms Counter */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLeft}>
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />
        </View>

        {/* Property Icon */}
        {propertyData.propertyCategory && (
          <View style={styles.propertyIconContainer}>
            {propertyData.propertyCategory === "house" ? (
              <Image
                source={require("../../../app/assets/icon.png")}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("../../../shared/components/ui/Apartment_logo.png")}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            )}
          </View>
        )}

        {/* Rooms Counter */}
        {propertyData.propertyCategory && (
          <View style={styles.roomsCounterContainer}>
            <AnimatedRoomCounter
              count={calculateTotalRooms()}
              size="md"
              showLabel={true}
            />
          </View>
        )}
      </View>

      {/* Step Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <Button
            title="Back"
            onPress={prevStep}
            variant="secondary"
            style={styles.navButton}
          />
        )}

        <View style={styles.navSpacer} />

        {currentStep < STEPS.length - 1 ? (
          <Button
            title="Next"
            onPress={nextStep}
            variant={validateCurrentStep() ? "primary" : "tertiary"}
            style={
              validateCurrentStep()
                ? styles.navButton
                : { ...styles.navButton, ...styles.disabledButton }
            }
            disabled={!validateCurrentStep()}
          />
        ) : (
          <Button
            title="Publish Property"
            onPress={publishProperty}
            variant="primary"
            style={styles.navButton}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    padding: spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    color: colors.neutral[700],
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.neutral[900],
  },
  draftButton: {
    padding: spacing.sm,
  },
  draftText: {
    ...textStyles.button,
    color: colors.primary[500],
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  progressLeft: {
    flex: 1,
  },
  propertyIconContainer: {
    marginLeft: spacing.md,
    padding: spacing.xs,
  },
  roomsCounterContainer: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.sm,
  },
  roomsCounterText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  navigation: {
    flexDirection: "row",
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  navButton: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navSpacer: {
    width: spacing.md,
  },
});
