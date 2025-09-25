import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../shared/hooks/state/authStore";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../shared/constants/tokens";
import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";
import Chip from "../../shared/components/ui/Chip";
import Slider from "../../shared/components/ui/Slider";
import Toggle from "../../shared/components/ui/Toggle";
import ImageUpload from "../../shared/components/ui/ImageUpload";
import MapPicker from "../../shared/components/ui/MapPicker";
import LocationPicker from "../../shared/components/ui/LocationPicker";
import { TelAvivLocation } from "../../shared/constants/locations";

interface ApartmentData {
  // Step 1 - Contact Info
  name: string;
  email: string;
  phone: string;

  // Step 2 - Location
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  area?: TelAvivLocation;

  // Step 3 - Basic Details
  bedrooms: number;
  bathrooms: number;
  renovation: "new" | "renovated" | "needs_work";
  size: number;

  // Step 4 - Amenities
  amenities: string[];

  // Step 5 - Photos
  photos: string[];

  // Step 6 - Pricing & Availability
  price: number;
  availableNow: boolean;
  availableFrom?: string;
  availableTo?: string;
}

const STEPS = [
  "Contact Info",
  "Location",
  "Basic Details",
  "Amenities",
  "Photos",
  "Pricing & Availability",
  "Review & Publish",
];

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
];

export default function AddApartmentScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [apartmentData, setApartmentData] = useState<ApartmentData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bedrooms: 1,
    bathrooms: 1,
    renovation: "new",
    size: 50,
    amenities: [],
    photos: [],
    price: 1200,
    availableNow: true,
  });

  const updateData = (updates: Partial<ApartmentData>) => {
    setApartmentData((prev) => ({ ...prev, ...updates }));
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

  const saveDraft = () => {
    Alert.alert(
      "Draft Saved",
      "Your apartment listing has been saved as a draft."
    );
  };

  const publishApartment = () => {
    Alert.alert(
      "Apartment Published!",
      "Your apartment listing is now live and visible to renters.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index <= currentStep
                    ? colors.primary[500]
                    : colors.neutral[300],
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.stepText}>
        Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Contact Information</Text>
      <Text style={styles.stepSubtitle}>
        This information will be shown to potential renters
      </Text>

      <Card style={styles.inputCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.textInput}
            value={apartmentData.name}
            onChangeText={(text) => updateData({ name: text })}
            placeholder="Your full name"
            placeholderTextColor={colors.neutral[400]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={apartmentData.email}
            onChangeText={(text) => updateData({ email: text })}
            placeholder="your@email.com"
            placeholderTextColor={colors.neutral[400]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone</Text>
          <TextInput
            style={styles.textInput}
            value={apartmentData.phone}
            onChangeText={(text) => updateData({ phone: text })}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor={colors.neutral[400]}
            keyboardType="phone-pad"
          />
        </View>
      </Card>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location</Text>
      <Text style={styles.stepSubtitle}>
        Help renters find your apartment easily
      </Text>

      <LocationPicker
        selectedLocation={apartmentData.area}
        onLocationSelect={(area) => updateData({ area })}
      />

      <MapPicker
        location={apartmentData.location}
        onLocationChange={(location) => updateData({ location })}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Details</Text>
      <Text style={styles.stepSubtitle}>
        Tell renters about your apartment's features
      </Text>

      <Card style={styles.inputCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bedrooms</Text>
          <View style={styles.chipContainer}>
            {[1, 2, 3, 4].map((count) => (
              <Chip
                key={count}
                label={count === 4 ? "other" : count.toString()}
                selected={apartmentData.bedrooms === count}
                onPress={() => updateData({ bedrooms: count })}
                variant="primary"
              />
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bathrooms</Text>
          <View style={styles.chipContainer}>
            {[1, 2, 3].map((count) => (
              <Chip
                key={count}
                label={count === 3 ? "3" : count.toString()}
                selected={apartmentData.bathrooms === count}
                onPress={() => updateData({ bathrooms: count })}
                variant="primary"
              />
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Renovation Status</Text>
          <View style={styles.chipContainer}>
            <Chip
              label="✨ New"
              selected={apartmentData.renovation === "new"}
              onPress={() => updateData({ renovation: "new" })}
              variant="primary"
            />
            <Chip
              label="🛠️ Renovated"
              selected={apartmentData.renovation === "renovated"}
              onPress={() => updateData({ renovation: "renovated" })}
              variant="primary"
            />
            <Chip
              label="🏚️ Needs work"
              selected={apartmentData.renovation === "needs_work"}
              onPress={() => updateData({ renovation: "needs_work" })}
              variant="primary"
            />
          </View>
        </View>

        <Slider
          label="Size"
          value={apartmentData.size}
          onValueChange={(value) => updateData({ size: value })}
          minimumValue={30}
          maximumValue={300}
          step={5}
          unit="m²"
        />
      </Card>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Amenities</Text>
      <Text style={styles.stepSubtitle}>
        Select all amenities available in your apartment
      </Text>

      <View style={styles.amenitiesGrid}>
        {AMENITIES.map((amenity) => (
          <Chip
            key={amenity.id}
            label={`${amenity.icon} ${amenity.label}`}
            selected={apartmentData.amenities.includes(amenity.id)}
            onPress={() => {
              const newAmenities = apartmentData.amenities.includes(amenity.id)
                ? apartmentData.amenities.filter((id) => id !== amenity.id)
                : [...apartmentData.amenities, amenity.id];
              updateData({ amenities: newAmenities });
            }}
            variant="primary"
            style={styles.amenityChip}
          />
        ))}
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Photos</Text>
      <Text style={styles.stepSubtitle}>
        Add photos to showcase your apartment
      </Text>

      <ImageUpload
        images={apartmentData.photos}
        onImagesChange={(photos) => updateData({ photos })}
        maxImages={10}
      />
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Pricing & Availability</Text>
      <Text style={styles.stepSubtitle}>
        Set your rental price and availability
      </Text>

      <Card style={styles.inputCard}>
        <Slider
          label="Monthly Rent"
          value={apartmentData.price}
          onValueChange={(value) => updateData({ price: value })}
          minimumValue={500}
          maximumValue={5000}
          step={50}
          unit="$"
        />

        <View style={styles.inputGroup}>
          <Toggle
            label="Available Now"
            value={apartmentData.availableNow}
            onValueChange={(value) => updateData({ availableNow: value })}
          />
        </View>

        {!apartmentData.availableNow && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Available From</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select date"
              placeholderTextColor={colors.neutral[400]}
            />
          </View>
        )}
      </Card>
    </View>
  );

  const renderStep7 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review & Publish</Text>
      <Text style={styles.stepSubtitle}>
        Review your listing before publishing
      </Text>

      <Card style={styles.reviewCard}>
        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Contact</Text>
          <Text style={styles.reviewValue}>{apartmentData.name}</Text>
          <Text style={styles.reviewValue}>{apartmentData.email}</Text>
          <Text style={styles.reviewValue}>{apartmentData.phone}</Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Location</Text>
          <Text style={styles.reviewValue}>
            {apartmentData.location?.address || "Not set"}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Details</Text>
          <Text style={styles.reviewValue}>
            {apartmentData.bedrooms} bed • {apartmentData.bathrooms} bath •{" "}
            {apartmentData.size}m²
          </Text>
          <Text style={styles.reviewValue}>
            Status: {apartmentData.renovation.replace("_", " ")}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Amenities</Text>
          <Text style={styles.reviewValue}>
            {apartmentData.amenities.length > 0
              ? apartmentData.amenities
                  .map((id) => AMENITIES.find((a) => a.id === id)?.label)
                  .join(", ")
              : "None selected"}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Pricing</Text>
          <Text style={styles.reviewValue}>${apartmentData.price}/month</Text>
          <Text style={styles.reviewValue}>
            {apartmentData.availableNow
              ? "Available now"
              : "Available from selected date"}
          </Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>Photos</Text>
          <Text style={styles.reviewValue}>
            {apartmentData.photos.length} photos uploaded
          </Text>
        </View>
      </Card>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      case 4:
        return renderStep5();
      case 5:
        return renderStep6();
      case 6:
        return renderStep7();
      default:
        return renderStep1();
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
        <Text style={styles.headerTitle}>Add New Apartment</Text>
        <TouchableOpacity style={styles.draftButton} onPress={saveDraft}>
          <Text style={styles.draftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      {renderProgressIndicator()}

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
            variant="primary"
            style={styles.navButton}
          />
        ) : (
          <Button
            title="Publish Apartment"
            onPress={publishApartment}
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
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  stepContainer: {
    flex: 1,
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
  inputCard: {
    marginBottom: spacing.lg,
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
  textInput: {
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    color: colors.neutral[900],
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  amenityChip: {
    marginBottom: spacing.sm,
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
  reviewLabel: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  reviewValue: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
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
  navSpacer: {
    width: spacing.md,
  },
});
