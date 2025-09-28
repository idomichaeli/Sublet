import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../../shared/constants/tokens";
import { StepProps } from "../types/PropertyCreationData";
import {
  TelAvivLocation,
  TEL_AVIV_LOCATIONS,
} from "../../../../shared/constants/locations";
import * as Location from "expo-location";

export default function LocationStep({ data, onUpdate }: StepProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showShelterOptions, setShowShelterOptions] = useState(false);
  const [showNeighborhoodPicker, setShowNeighborhoodPicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Animation for loading state
  React.useEffect(() => {
    if (isGeocoding) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isGeocoding]);

  // Function to validate if address is in Tel Aviv
  const validateTelAvivAddress = async (
    street: string,
    number: string
  ): Promise<boolean> => {
    if (!street || !number) return false;

    try {
      const fullAddress = `${street} ${number}, Tel Aviv, Israel`;
      const geocodeResult = await Location.geocodeAsync(fullAddress);

      if (geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];

        // Check if coordinates are within Tel Aviv bounds
        const telAvivBounds = {
          north: 32.15,
          south: 32.05,
          east: 34.85,
          west: 34.75,
        };

        return (
          latitude >= telAvivBounds.south &&
          latitude <= telAvivBounds.north &&
          longitude >= telAvivBounds.west &&
          longitude <= telAvivBounds.east
        );
      }
    } catch (error) {
      console.log("Address validation error:", error);
    }

    return false;
  };

  // Function to find the closest neighborhood based on coordinates
  const findNeighborhoodFromCoordinates = (
    latitude: number,
    longitude: number
  ): typeof TelAvivLocation | null => {
    let closestArea: typeof TelAvivLocation | null = null;
    let minDistance = Infinity;

    TEL_AVIV_LOCATIONS.forEach((areaName) => {
      // For now, just return the first location since TEL_AVIV_LOCATIONS is an array of strings
      if (areaName) {
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in kilometers
        const dLat =
          ((latitude - TelAvivLocation.coordinates.lat) * Math.PI) / 180;
        const dLon =
          ((longitude - TelAvivLocation.coordinates.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((TelAvivLocation.coordinates.lat * Math.PI) / 180) *
            Math.cos((latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers

        if (distance < minDistance) {
          minDistance = distance;
          closestArea = TelAvivLocation;
        }
      }
    });

    return closestArea;
  };

  // Function to detect area from address
  const detectAreaFromAddress = async (street: string, number: string) => {
    if (!street || !number) return;

    setIsGeocoding(true);

    try {
      const fullAddress = `${street} ${number}, Tel Aviv, Israel`;
      const geocodeResult = await Location.geocodeAsync(fullAddress);

      if (geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];

        // Find the closest neighborhood
        const detectedArea = findNeighborhoodFromCoordinates(
          latitude,
          longitude
        );

        if (detectedArea) {
          onUpdate({ area: detectedArea });
          onUpdate({
            location: {
              latitude,
              longitude,
              address: fullAddress,
            },
          });
        }
      }
    } catch (error) {
      console.log("Geocoding error:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleStreetChange = (street: string) => {
    onUpdate({ street });
    if (street && data.streetNumber) {
      detectAreaFromAddress(street, data.streetNumber);
    }
  };

  const handleStreetNumberChange = (number: string) => {
    onUpdate({ streetNumber: number });
    if (data.street && number) {
      detectAreaFromAddress(data.street, number);
    }
  };

  const handleShelterChange = (hasShelter: boolean) => {
    onUpdate({ hasShelter });
    setShowShelterOptions(hasShelter);

    if (!hasShelter) {
      onUpdate({
        shelterLocation: undefined,
        shelterDistance: undefined,
      });
    }
  };

  const handleShelterLocationChange = (
    location: "in_apartment" | "in_floor" | "in_building" | "other"
  ) => {
    onUpdate({ shelterLocation: location });

    if (location !== "other") {
      onUpdate({ shelterDistance: undefined });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Confirm Your Address</Text>
        </View>

        {/* Address Form */}
        <View style={styles.addressForm}>
          {/* Street Input Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Street Name</Text>
              <TextInput
                style={styles.textInput}
                value={data.street}
                onChangeText={handleStreetChange}
                onFocus={() => setFocusedInput("street")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Enter street name"
                placeholderTextColor={colors.neutral[400]}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Number</Text>
              <TextInput
                style={styles.textInput}
                value={data.streetNumber}
                onChangeText={handleStreetNumberChange}
                onFocus={() => setFocusedInput("number")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Number"
                placeholderTextColor={colors.neutral[400]}
                keyboardType="numeric"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Floor and Apartment Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Floor</Text>
              <TextInput
                style={styles.textInput}
                value={data.floor}
                onChangeText={(floor) => onUpdate({ floor })}
                onFocus={() => setFocusedInput("floor")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Floor number"
                placeholderTextColor={colors.neutral[400]}
                keyboardType="numeric"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Apartment</Text>
              <TextInput
                style={styles.textInput}
                value={data.apartmentNumber}
                onChangeText={(apartmentNumber) =>
                  onUpdate({ apartmentNumber })
                }
                onFocus={() => setFocusedInput("apartment")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Apartment number"
                placeholderTextColor={colors.neutral[400]}
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Neighborhood */}
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>Neighborhood</Text>
            <TouchableOpacity
              style={styles.neighborhoodSelector}
              onPress={() => setShowNeighborhoodPicker(true)}
            >
              <Text
                style={[
                  styles.neighborhoodText,
                  !data.area?.name && styles.placeholderText,
                ]}
              >
                {data.area?.name || "Select neighborhood"}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* City */}
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>City/Municipality</Text>
            <TextInput
              style={styles.textInput}
              value="Tel Aviv"
              placeholder="City"
              placeholderTextColor={colors.neutral[400]}
              editable={false}
            />
          </View>

          {/* Neighborhood Picker Modal */}
          {showNeighborhoodPicker && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Neighborhood</Text>
                  <TouchableOpacity
                    onPress={() => setShowNeighborhoodPicker(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.neighborhoodList}>
                  {TEL_AVIV_LOCATIONS.map((neighborhood, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.neighborhoodOption,
                        data.area?.name === neighborhood &&
                          styles.neighborhoodOptionSelected,
                      ]}
                      onPress={() => {
                        onUpdate({
                          ...data,
                          area: {
                            id: `neighborhood-${index}`,
                            name: neighborhood,
                            coordinates: { lat: 32.0853, lng: 34.7818 },
                            areas: [
                              {
                                id: `neighborhood-${index}`,
                                name: neighborhood,
                                city: "Tel Aviv",
                                apartments: 0,
                              },
                            ],
                          },
                        });
                        setShowNeighborhoodPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.neighborhoodOptionText,
                          data.area?.name === neighborhood &&
                            styles.neighborhoodOptionTextSelected,
                        ]}
                      >
                        {neighborhood}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* State */}
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>State</Text>
            <TextInput
              style={styles.textInput}
              value="Tel Aviv District"
              placeholder="State"
              placeholderTextColor={colors.neutral[400]}
              editable={false}
            />
          </View>

          {/* Postcode */}
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>Postal Code</Text>
            <TextInput
              style={styles.textInput}
              value={data.postcode}
              onChangeText={(postcode) => onUpdate({ postcode })}
              onFocus={() => setFocusedInput("postcode")}
              onBlur={() => setFocusedInput(null)}
              placeholder="Enter postal code"
              placeholderTextColor={colors.neutral[400]}
              keyboardType="numeric"
              autoCorrect={false}
            />
          </View>

          {/* Area Display */}
          {data.area && (
            <View style={styles.areaDisplay}>
              <Text style={styles.areaText}>
                Detected Area: {data.area.name}
              </Text>
            </View>
          )}

          {isGeocoding && (
            <Animated.View
              style={[
                styles.loadingContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.loadingText}>Detecting area...</Text>
            </Animated.View>
          )}
        </View>

        {/* Location Privacy Section */}
        <View style={styles.privacySection}>
          <View style={styles.privacyHeader}>
            <Text style={styles.privacyTitle}>Show your specific location</Text>
            <TouchableOpacity style={styles.toggleSwitch}>
              <View style={styles.toggleTrack}>
                <View style={styles.toggleThumb} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.privacyDescription}>
            Clearly indicate to guests the location of your accommodation. We
            will only share your address after the reservation is confirmed.{" "}
            <Text style={styles.learnMoreLink}>Learn more</Text>
          </Text>
        </View>

        {/* Map Preview */}
        <View style={styles.mapPreview}>
          <Text style={styles.mapText}>
            We will share your approximate location.
          </Text>
        </View>

        {/* Shelter Section */}
        <View style={styles.shelterSection}>
          <Text style={styles.shelterTitle}>Shelter Information</Text>
          <Text style={styles.shelterQuestion}>Is there a shelter?</Text>

          <View style={styles.shelterOptions}>
            <TouchableOpacity
              style={[
                styles.shelterOption,
                data.hasShelter === true && styles.shelterOptionSelected,
              ]}
              onPress={() => handleShelterChange(true)}
            >
              <Text
                style={[
                  styles.shelterOptionText,
                  data.hasShelter === true && styles.shelterOptionTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.shelterOption,
                data.hasShelter === false && styles.shelterOptionSelected,
              ]}
              onPress={() => handleShelterChange(false)}
            >
              <Text
                style={[
                  styles.shelterOptionText,
                  data.hasShelter === false && styles.shelterOptionTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          {/* Shelter Location Options */}
          {showShelterOptions && (
            <View style={styles.shelterLocationContainer}>
              <Text style={styles.shelterQuestion}>
                Where is the shelter located?
              </Text>

              <TouchableOpacity
                style={[
                  styles.shelterLocationOption,
                  data.shelterLocation === "in_apartment" &&
                    styles.shelterLocationOptionSelected,
                ]}
                onPress={() => handleShelterLocationChange("in_apartment")}
              >
                <Text
                  style={[
                    styles.shelterLocationText,
                    data.shelterLocation === "in_apartment" &&
                      styles.shelterLocationTextSelected,
                  ]}
                >
                  In the apartment
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shelterLocationOption,
                  data.shelterLocation === "in_floor" &&
                    styles.shelterLocationOptionSelected,
                ]}
                onPress={() => handleShelterLocationChange("in_floor")}
              >
                <Text
                  style={[
                    styles.shelterLocationText,
                    data.shelterLocation === "in_floor" &&
                      styles.shelterLocationTextSelected,
                  ]}
                >
                  In the floor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shelterLocationOption,
                  data.shelterLocation === "in_building" &&
                    styles.shelterLocationOptionSelected,
                ]}
                onPress={() => handleShelterLocationChange("in_building")}
              >
                <Text
                  style={[
                    styles.shelterLocationText,
                    data.shelterLocation === "in_building" &&
                      styles.shelterLocationTextSelected,
                  ]}
                >
                  In the building
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shelterLocationOption,
                  data.shelterLocation === "other" &&
                    styles.shelterLocationOptionSelected,
                ]}
                onPress={() => handleShelterLocationChange("other")}
              >
                <Text
                  style={[
                    styles.shelterLocationText,
                    data.shelterLocation === "other" &&
                      styles.shelterLocationTextSelected,
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>

              {/* Distance Input for "Other" option */}
              {data.shelterLocation === "other" && (
                <View style={styles.distanceInputContainer}>
                  <Text style={styles.fieldLabel}>
                    How far is the closest shelter? (in meters)
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    value={data.shelterDistance?.toString() || ""}
                    onChangeText={(distance) =>
                      onUpdate({
                        shelterDistance: distance
                          ? parseInt(distance)
                          : undefined,
                      })
                    }
                    onFocus={() => setFocusedInput("distance")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter distance in meters"
                    placeholderTextColor={colors.neutral[400]}
                    keyboardType="numeric"
                    autoCorrect={false}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    padding: spacing.lg,
  },

  // Header Section
  headerSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral[900],
    textAlign: "center",
    fontWeight: "700",
  },

  // Address Form
  addressForm: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  // Input Layout
  inputRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  inputField: {
    flex: 1,
  },
  fieldLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  textInput: {
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[50],
    color: colors.neutral[900],
    fontSize: 16,
  },

  // Area Display
  areaDisplay: {
    backgroundColor: colors.success[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  areaText: {
    ...textStyles.caption,
    color: colors.success[700],
    fontWeight: "600",
  },

  // Loading State
  loadingContainer: {
    backgroundColor: colors.warning[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  loadingText: {
    ...textStyles.caption,
    color: colors.warning[700],
    fontWeight: "500",
  },

  // Privacy Section
  privacySection: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  privacyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  privacyTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    flex: 1,
  },
  toggleSwitch: {
    marginLeft: spacing.md,
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.neutral[300],
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.neutral[0],
    ...shadows.sm,
  },
  privacyDescription: {
    ...textStyles.caption,
    color: colors.neutral[600],
    lineHeight: 20,
  },
  learnMoreLink: {
    color: colors.primary[600],
    textDecorationLine: "underline",
  },

  // Map Preview
  mapPreview: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  mapText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    textAlign: "center",
  },

  // Shelter Section
  shelterSection: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  shelterTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.lg,
  },
  neighborhoodSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[0],
  },
  neighborhoodText: {
    ...textStyles.body,
    color: colors.neutral[900],
    flex: 1,
  },
  placeholderText: {
    color: colors.neutral[400],
  },
  dropdownIcon: {
    ...textStyles.caption,
    color: colors.neutral[500],
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    width: "90%",
    maxHeight: "70%",
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    ...textStyles.h3,
    color: colors.neutral[500],
  },
  neighborhoodList: {
    maxHeight: 400,
  },
  neighborhoodOption: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  neighborhoodOptionSelected: {
    backgroundColor: colors.primary[50],
  },
  neighborhoodOptionText: {
    ...textStyles.body,
    color: colors.neutral[900],
  },
  neighborhoodOptionTextSelected: {
    color: colors.primary[600],
    fontWeight: "600",
  },
  shelterQuestion: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.md,
    fontWeight: "500",
  },
  shelterOptions: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  shelterOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[50],
    alignItems: "center",
  },
  shelterOptionSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  shelterOptionText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  shelterOptionTextSelected: {
    color: colors.neutral[0],
  },

  // Shelter Location Options
  shelterLocationContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  shelterLocationOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[50],
    marginBottom: spacing.sm,
  },
  shelterLocationOptionSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  shelterLocationText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  shelterLocationTextSelected: {
    color: colors.neutral[0],
  },

  // Distance Input
  distanceInputContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
});
