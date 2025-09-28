import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../../shared/constants/tokens";
import { PropertyType } from "../types/PropertyCreationData";
import BottomSheet from "../../../../shared/components/ui/BottomSheet";

const PROPERTY_TYPES = [
  {
    id: "entire_place" as PropertyType,
    label: "An entire place",
    icon: "🏠",
    description: "Guests have the whole place to themselves.",
  },
  {
    id: "room" as PropertyType,
    label: "A room",
    icon: "🚪",
    description:
      "Guests have their own room in a home, plus access to shared spaces.",
  },
  {
    id: "shared_room" as PropertyType,
    label: "A shared room",
    icon: "👥",
    description: "Guests sleep in a shared room in a property.",
  },
];

interface PropertyTypeBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedType?: PropertyType;
  onSelect: (propertyType: PropertyType) => void;
}

export default function PropertyTypeBottomSheet({
  visible,
  onClose,
  selectedType,
  onSelect,
}: PropertyTypeBottomSheetProps) {
  const handlePropertyTypeSelect = (propertyType: PropertyType) => {
    onSelect(propertyType);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="What type of place will guests have?"
      height={530}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.propertyContainer}>
          {PROPERTY_TYPES.map((property) => {
            const isSelected = selectedType === property.id;

            return (
              <TouchableOpacity
                key={property.id}
                style={[
                  styles.propertyCard,
                  isSelected && styles.propertyCardSelected,
                ]}
                onPress={() => handlePropertyTypeSelect(property.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.propertyLabel,
                        isSelected && styles.propertyLabelSelected,
                      ]}
                    >
                      {property.label}
                    </Text>
                    <Text
                      style={[
                        styles.propertyDescription,
                        isSelected && styles.propertyDescriptionSelected,
                      ]}
                    >
                      {property.description}
                    </Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{property.icon}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  propertyContainer: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  propertyCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    ...shadows.sm,
  },
  propertyCardSelected: {
    borderColor: colors.neutral[900],
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  propertyLabel: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  propertyLabelSelected: {
    color: colors.neutral[900],
  },
  propertyDescription: {
    ...textStyles.body,
    color: colors.neutral[600],
    lineHeight: 20,
  },
  propertyDescriptionSelected: {
    color: colors.neutral[600],
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 32,
    textAlign: "center",
  },
});
