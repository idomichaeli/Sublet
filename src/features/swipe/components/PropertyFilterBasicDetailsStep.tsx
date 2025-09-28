import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";
import Chip from "../../../shared/components/ui/Chip";
import Input from "../../../shared/components/ui/Input";
import { FilterData, FilterStepProps } from "../types/PropertyFilterData";

export default function PropertyFilterBasicDetailsStep({
  data,
  onUpdate,
}: FilterStepProps) {
  return (
    <View style={styles.container}>
      {/* Property Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Property Type</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.propertyType}
            onPress={() => onUpdate({ propertyType: undefined })}
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
        </View>
      </View>

      {/* Bedrooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bedrooms</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.bedrooms}
            onPress={() => onUpdate({ bedrooms: undefined })}
            variant="primary"
          />
          {[1, 2, 3, 4].map((count) => (
            <Chip
              key={count}
              label={count === 4 ? "4+" : count.toString()}
              selected={data.bedrooms === count}
              onPress={() => onUpdate({ bedrooms: count })}
              variant="primary"
            />
          ))}
        </View>
      </View>

      {/* Living Room */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Living Room</Text>
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
      </View>

      {/* Bathrooms */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bathrooms</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.bathrooms}
            onPress={() => onUpdate({ bathrooms: undefined })}
            variant="primary"
          />
          {[1, 2, 3].map((count) => (
            <Chip
              key={count}
              label={count === 3 ? "3+" : count.toString()}
              selected={data.bathrooms === count}
              onPress={() => onUpdate({ bathrooms: count })}
              variant="primary"
            />
          ))}
        </View>
      </View>

      {/* Size Range */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Size Range (m²)</Text>
        <View style={styles.sizeRangeContainer}>
          <View style={styles.sizeInputContainer}>
            <Input
              label="Min Size"
              placeholder="30"
              value={data.minSize?.toString() || ""}
              onChangeText={(text) =>
                onUpdate({ minSize: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              style={styles.sizeInput}
            />
          </View>
          <Text style={styles.sizeRangeSeparator}>to</Text>
          <View style={styles.sizeInputContainer}>
            <Input
              label="Max Size"
              placeholder="500"
              value={data.maxSize?.toString() || ""}
              onChangeText={(text) =>
                onUpdate({ maxSize: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              style={styles.sizeInput}
            />
          </View>
        </View>
      </View>

      {/* Renovation Status */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Renovation Status</Text>
        <View style={styles.chipContainer}>
          <Chip
            label="Any"
            selected={!data.renovation || data.renovation === "any"}
            onPress={() => onUpdate({ renovation: "any" })}
            variant="primary"
          />
          <Chip
            label="Renovated"
            selected={data.renovation === "renovated"}
            onPress={() => onUpdate({ renovation: "renovated" })}
            variant="primary"
          />
          <Chip
            label="Needs Work"
            selected={data.renovation === "needs_work"}
            onPress={() => onUpdate({ renovation: "needs_work" })}
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
  sizeRangeContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
  },
  sizeInputContainer: {
    flex: 1,
  },
  sizeInput: {
    flex: 1,
  },
  sizeRangeSeparator: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
});
