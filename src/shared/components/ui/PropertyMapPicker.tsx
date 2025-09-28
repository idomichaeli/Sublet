import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
} from "../../../shared/constants/tokens";
import { TelAvivLocation } from "../../constants/locations";
import Button from "./Button";

export interface MapPickerProps {
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  selectedArea?: typeof TelAvivLocation;
  style?: any;
}

const { width } = Dimensions.get("window");

export default function MapPicker({
  location,
  onLocationChange,
  selectedArea,
  style,
}: MapPickerProps) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(location?.address || "");
  const [mapReady, setMapReady] = useState(false);

  // Function to get appropriate radius for different areas
  const getAreaRadius = (areaId: string): number => {
    const areaRadiusMap: { [key: string]: number } = {
      city_center: 800, // Large central area
      lev_hair: 600, // Medium historic area
      kerem_hateimanim: 400, // Small neighborhood
      florentin: 700, // Medium hipster area
      neve_tzedek: 500, // Medium trendy area
      jaffa: 1000, // Large historic area
      allenby_carmel: 600, // Medium bustling area
      sarona_hakirya: 800, // Large modern area
      hayarkon_namal: 900, // Large port area
      bavli: 400, // Small residential
      montefiore: 500, // Medium mixed area
      shapira: 600, // Medium diverse area
      neve_shaanan: 500, // Medium bus station area
      kikar_hamedina: 700, // Large luxury area
      old_north: 800, // Large northern area
      new_north: 900, // Large park area
      ramat_aviv: 1000, // Large university area
      kiryat_shalom: 500, // Medium residential
      yad_eliyahu: 600, // Medium sports area
      ramat_hahayal: 800, // Large business hub
      hatikva_quarter: 500, // Medium traditional area
    };

    return areaRadiusMap[areaId] || 600; // Default radius
  };

  // Development: Set your current location here
  const DEV_LOCATION = {
    latitude: 32.0755, // Tel Aviv City Center - change this to your location
    longitude: 34.7755,
    address: "Dizengoff Center, Tel Aviv, Israel", // change this to your address
  };

  // Default region for Tel Aviv
  const defaultRegion = {
    latitude: 32.0853,
    longitude: 34.7818,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Current map region based on location
  const mapRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : defaultRegion;

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your location to suggest your address."
      );
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      // In development, use the dev location if permission is denied
      setAddress(DEV_LOCATION.address);
      onLocationChange(DEV_LOCATION);
      return;
    }

    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocode to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const formattedAddress = `${addr.street || ""} ${
          addr.streetNumber || ""
        }, ${addr.city || ""}, ${addr.region || ""}`.trim();

        setAddress(formattedAddress);
        onLocationChange({
          latitude,
          longitude,
          address: formattedAddress,
        });
      }
    } catch (error) {
      // In development, fall back to dev location on error
      console.log("Location error, using dev location:", error);
      setAddress(DEV_LOCATION.address);
      onLocationChange(DEV_LOCATION);
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    try {
      // Reverse geocode to get a better address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const formattedAddress = `${addr.street || ""} ${
          addr.streetNumber || ""
        }, ${addr.city || ""}, ${addr.region || ""}`.trim();

        if (formattedAddress.length > 10) {
          address = formattedAddress;
        }
      }

      const newLocation = {
        latitude,
        longitude,
        address,
      };

      setAddress(address);
      onLocationChange(newLocation);
    } catch (error) {
      // Fallback to coordinates if geocoding fails
      const newLocation = {
        latitude,
        longitude,
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      };
      setAddress(newLocation.address);
      onLocationChange(newLocation);
    }
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    // In a real app, you'd geocode this address
    if (location) {
      onLocationChange({
        ...location,
        address: text,
      });
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Location</Text>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Selected Area Info */}
        {selectedArea && (
          <View style={styles.selectedAreaInfo}>
            <Text style={styles.areaInfoTitle}>📍 Selected Area</Text>
            <Text style={styles.areaInfoName}>{selectedArea.name}</Text>
            <Text style={styles.areaInfoDescription}>Tel Aviv Area</Text>
          </View>
        )}

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={mapRegion}
          onPress={handleMapPress}
          onMapReady={() => setMapReady(true)}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          loadingEnabled={true}
          loadingIndicatorColor={colors.primary[500]}
        >
          {/* Show marker for current location */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Property Location"
              description={
                selectedArea
                  ? `${selectedArea.name} - ${location.address}`
                  : location.address
              }
              pinColor={colors.primary[500]}
            />
          )}

          {/* Show area circle for selected area */}
          {selectedArea?.coordinates && (
            <Circle
              center={{
                latitude: selectedArea.coordinates.lat,
                longitude: selectedArea.coordinates.lng,
              }}
              radius={getAreaRadius(selectedArea.id)} // Dynamic radius based on area
              strokeColor={colors.primary[500]}
              fillColor={`${colors.primary[500]}15`} // 15% opacity
              strokeWidth={3}
            />
          )}
        </MapView>

        {/* Map overlay with instructions */}
        {mapReady && (
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>
              {location
                ? "📍 Tap to change location"
                : "📍 Tap on the map to set your property location"}
            </Text>
          </View>
        )}
      </View>

      {/* Map Instructions */}
      <View style={styles.mapInstructions}>
        <Text style={styles.instructionsText}>
          📍 Use the buttons below to set your property location
        </Text>
      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={getCurrentLocation}
        disabled={loading}
      >
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText}>
          {loading ? "Detecting..." : "Use Current Location"}
        </Text>
      </TouchableOpacity>

      {/* Development: Quick location setter */}
      <TouchableOpacity
        style={styles.devLocationButton}
        onPress={() => {
          setAddress(DEV_LOCATION.address);
          onLocationChange(DEV_LOCATION);
        }}
      >
        <Text style={styles.devLocationText}>
          🏠 Use Dev Location (Tel Aviv)
        </Text>
      </TouchableOpacity>

      {/* Address Input */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Address</Text>
        <TextInput
          style={styles.addressInput}
          value={address}
          onChangeText={handleAddressChange}
          placeholder="Enter your address"
          placeholderTextColor={colors.neutral[400]}
        />
      </View>

      {location && (
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>
            📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  mapContainer: {
    height: 300,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...shadows.sm,
  },
  mapOverlayText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    textAlign: "center",
    fontWeight: "500",
  },
  mapInstructions: {
    backgroundColor: colors.primary[50],
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[500],
  },
  instructionsText: {
    ...textStyles.caption,
    color: colors.primary[700],
    textAlign: "center",
    fontWeight: "500",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  locationText: {
    ...textStyles.button,
    color: colors.neutral[0],
  },
  devLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary[500],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  devLocationText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "500",
  },
  addressContainer: {
    marginBottom: spacing.sm,
  },
  addressLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  addressInput: {
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    color: colors.neutral[900],
  },
  coordinatesContainer: {
    backgroundColor: colors.neutral[50],
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[500],
  },
  coordinatesText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontFamily: "monospace",
  },
  selectedAreaInfo: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
    ...shadows.sm,
  },
  areaInfoTitle: {
    ...textStyles.caption,
    color: colors.primary[700],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  areaInfoName: {
    ...textStyles.body,
    color: colors.primary[800],
    fontWeight: "600",
    marginBottom: 2,
  },
  areaInfoDescription: {
    ...textStyles.caption,
    color: colors.primary[600],
  },
});
