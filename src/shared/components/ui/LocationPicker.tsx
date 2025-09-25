import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { TEL_AVIV_LOCATIONS, TelAvivLocation } from "../../constants/locations";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../constants/tokens";
import Card from "./Card";
import Button from "./Button";

export interface LocationPickerProps {
  selectedLocation?: TelAvivLocation;
  onLocationSelect: (location: TelAvivLocation) => void;
  style?: any;
}

export default function LocationPicker({
  selectedLocation,
  onLocationSelect,
  style,
}: LocationPickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = TEL_AVIV_LOCATIONS.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: TelAvivLocation) => {
    onLocationSelect(location);
    setIsModalVisible(false);
    setSearchQuery("");
  };

  const renderLocationItem = (location: TelAvivLocation) => (
    <TouchableOpacity
      key={location.id}
      style={[
        styles.locationItem,
        selectedLocation?.id === location.id && styles.selectedLocationItem,
      ]}
      onPress={() => handleLocationSelect(location)}
    >
      <View style={styles.locationContent}>
        <Text
          style={[
            styles.locationName,
            selectedLocation?.id === location.id && styles.selectedLocationName,
          ]}
        >
          {location.name}
        </Text>
        <Text
          style={[
            styles.locationDescription,
            selectedLocation?.id === location.id &&
              styles.selectedLocationDescription,
          ]}
        >
          {location.description}
        </Text>
      </View>
      {selectedLocation?.id === location.id && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Tel Aviv Area</Text>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.pickerContent}>
          <Text style={styles.pickerIcon}>📍</Text>
          <View style={styles.pickerTextContainer}>
            <Text style={styles.pickerText}>
              {selectedLocation
                ? selectedLocation.name
                : "Select area in Tel Aviv"}
            </Text>
            {selectedLocation && (
              <Text style={styles.pickerSubtext}>
                {selectedLocation.description}
              </Text>
            )}
          </View>
          <Text style={styles.pickerArrow}>▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Tel Aviv Area</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search areas..."
              placeholderTextColor={colors.neutral[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView
            style={styles.locationsList}
            showsVerticalScrollIndicator={false}
          >
            {filteredLocations.map(renderLocationItem)}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  pickerButton: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.md,
    ...shadows.sm,
  },
  pickerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  pickerTextContainer: {
    flex: 1,
  },
  pickerText: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "500",
  },
  pickerSubtext: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginTop: 2,
  },
  pickerArrow: {
    ...textStyles.caption,
    color: colors.neutral[500],
    marginLeft: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontWeight: "600",
  },
  searchContainer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  searchInput: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...textStyles.body,
    color: colors.neutral[900],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  locationsList: {
    flex: 1,
    padding: spacing.lg,
  },
  locationItem: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    flexDirection: "row",
    alignItems: "center",
    ...shadows.sm,
  },
  selectedLocationItem: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  locationContent: {
    flex: 1,
  },
  locationName: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: 2,
  },
  selectedLocationName: {
    color: colors.primary[700],
  },
  locationDescription: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  selectedLocationDescription: {
    color: colors.primary[600],
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  checkmarkText: {
    color: colors.neutral[0],
    fontSize: 14,
    fontWeight: "600",
  },
});
