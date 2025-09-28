import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";
import Chip from "../../../shared/components/ui/Chip";
import Input from "../../../shared/components/ui/Input";
import { FilterData, FilterStepProps } from "../types/PropertyFilterData";

export default function PropertyFilterPriceLocationStep({
  data,
  onUpdate,
}: FilterStepProps) {
  return (
    <View style={styles.container}>
      {/* Price Range */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Price Range (per month)</Text>
        <View style={styles.priceRangeContainer}>
          <View style={styles.priceInputContainer}>
            <Input
              label="Min Price"
              placeholder="500"
              value={data.minPrice?.toString() || ""}
              onChangeText={(text) =>
                onUpdate({ minPrice: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              style={styles.priceInput}
            />
          </View>
          <Text style={styles.priceRangeSeparator}>to</Text>
          <View style={styles.priceInputContainer}>
            <Input
              label="Max Price"
              placeholder="5000"
              value={data.maxPrice?.toString() || ""}
              onChangeText={(text) =>
                onUpdate({ maxPrice: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              style={styles.priceInput}
            />
          </View>
        </View>
      </View>

      {/* Areas */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tel Aviv Areas</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.areas || data.areas.length === 0}
            onPress={() => onUpdate({ areas: undefined })}
            variant="primary"
          />
          <Chip
            label="Tel Aviv Center"
            selected={data.areas?.includes("tel-aviv-center") || false}
            onPress={() => {
              const currentAreas = data.areas || [];
              const newAreas = currentAreas.includes("tel-aviv-center")
                ? currentAreas.filter((a) => a !== "tel-aviv-center")
                : [...currentAreas, "tel-aviv-center"];
              onUpdate({ areas: newAreas });
            }}
            variant="primary"
          />
          <Chip
            label="Florentin"
            selected={data.areas?.includes("florentin") || false}
            onPress={() => {
              const currentAreas = data.areas || [];
              const newAreas = currentAreas.includes("florentin")
                ? currentAreas.filter((a) => a !== "florentin")
                : [...currentAreas, "florentin"];
              onUpdate({ areas: newAreas });
            }}
            variant="primary"
          />
          <Chip
            label="Neve Tzedek"
            selected={data.areas?.includes("neve-tzedek") || false}
            onPress={() => {
              const currentAreas = data.areas || [];
              const newAreas = currentAreas.includes("neve-tzedek")
                ? currentAreas.filter((a) => a !== "neve-tzedek")
                : [...currentAreas, "neve-tzedek"];
              onUpdate({ areas: newAreas });
            }}
            variant="primary"
          />
          <Chip
            label="Rothschild Boulevard"
            selected={data.areas?.includes("rothschild") || false}
            onPress={() => {
              const currentAreas = data.areas || [];
              const newAreas = currentAreas.includes("rothschild")
                ? currentAreas.filter((a) => a !== "rothschild")
                : [...currentAreas, "rothschild"];
              onUpdate({ areas: newAreas });
            }}
            variant="primary"
          />
          <Chip
            label="Dizengoff Center"
            selected={data.areas?.includes("dizengoff") || false}
            onPress={() => {
              const currentAreas = data.areas || [];
              const newAreas = currentAreas.includes("dizengoff")
                ? currentAreas.filter((a) => a !== "dizengoff")
                : [...currentAreas, "dizengoff"];
              onUpdate({ areas: newAreas });
            }}
            variant="primary"
          />
          <Chip
            label="Old Jaffa"
            selected={data.areas?.includes("old-jaffa") || false}
            onPress={() => {
              const currentAreas = data.areas || [];
              const newAreas = currentAreas.includes("old-jaffa")
                ? currentAreas.filter((a) => a !== "old-jaffa")
                : [...currentAreas, "old-jaffa"];
              onUpdate({ areas: newAreas });
            }}
            variant="primary"
          />
          <Chip
            label="Ramat Aviv"
            selected={data.areas?.includes("ramat-aviv") || false}
            onPress={() => {
              const currentAreas = data.areas || [];
              const newAreas = currentAreas.includes("ramat-aviv")
                ? currentAreas.filter((a) => a !== "ramat-aviv")
                : [...currentAreas, "ramat-aviv"];
              onUpdate({ areas: newAreas });
            }}
            variant="primary"
          />
          <Chip
            label="Hatikva"
            selected={data.areas?.includes("hatikva") || false}
            onPress={() => {
              const currentAreas = data.areas || [];
              const newAreas = currentAreas.includes("hatikva")
                ? currentAreas.filter((a) => a !== "hatikva")
                : [...currentAreas, "hatikva"];
              onUpdate({ areas: newAreas });
            }}
            variant="primary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  priceRangeContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceInput: {
    flex: 1,
  },
  priceRangeSeparator: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
});
