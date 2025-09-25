import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../../shared/constants/tokens";
import { StepProps, PropertyCategory } from "../types/PropertyData";
import PropertyTypeBottomSheet from "../components/PropertyTypeBottomSheet";

const PROPERTY_CATEGORIES = [
  {
    id: "house" as PropertyCategory,
    label: "House",
    icon: "house",
  },
  {
    id: "apartment" as PropertyCategory,
    label: "Apartment",
    icon: "apartment",
  },
];

export default function PropertyCategoryStep({ data, onUpdate }: StepProps) {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handlePropertyCategorySelect = (propertyCategory: PropertyCategory) => {
    onUpdate({ propertyCategory });
    setIsBottomSheetVisible(true);
  };

  const handlePropertyTypeSelect = (propertyType: any) => {
    onUpdate({ propertyType });
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Which of these best describes your place?
        </Text>

        <View style={styles.propertyContainer}>
          {PROPERTY_CATEGORIES.map((property) => {
            const isSelected = data.propertyCategory === property.id;

            return (
              <TouchableOpacity
                key={property.id}
                style={[
                  styles.propertyCard,
                  isSelected && styles.propertyCardSelected,
                ]}
                onPress={() => handlePropertyCategorySelect(property.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={
                        property.icon === "house"
                          ? require("../../../../assets/icon.png")
                          : require("../../../../shared/components/ui/Apartment_logo.png")
                      }
                      style={{ width: 120, height: 120 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.propertyLabel,
                      isSelected && styles.propertyLabelSelected,
                    ]}
                  >
                    {property.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <PropertyTypeBottomSheet
        visible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
        selectedType={data.propertyType}
        onSelect={handlePropertyTypeSelect}
      />
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
    paddingTop: spacing.xl,
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral[900],
    marginBottom: spacing.xl,
    fontWeight: "700",
    textAlign: "center",
  },
  propertyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  propertyCard: {
    flex: 1,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    ...shadows.sm,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
    minWidth: 170,
  },
  propertyCardSelected: {
    borderColor: colors.neutral[900],
    borderWidth: 2,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 48,
    textAlign: "center",
  },
  propertyLabel: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    textAlign: "center",
  },
  propertyLabelSelected: {
    color: colors.neutral[900],
  },
});
