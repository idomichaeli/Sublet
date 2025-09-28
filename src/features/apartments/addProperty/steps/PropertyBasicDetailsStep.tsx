import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
} from "../../../../shared/constants/tokens";
import Card from "../../../../shared/components/ui/Card";
import Chip from "../../../../shared/components/ui/Chip";
import SizeInput from "../../../../shared/components/ui/SizeInput";
import Input from "../../../../shared/components/ui/Input";
import Toggle from "../../../../shared/components/ui/Toggle";
import { StepProps } from "../types/PropertyCreationData";

// Specific room options (shown above Additional Rooms)
const SPECIFIC_ROOMS = ["Kitchen", "Balcony", "Garden/Yard", "Pantry"];

// Additional room options
const ADDITIONAL_ROOMS = [
  "Dining room",
  "Office room",
  "Garage",
  "Closet room",
  "Outdoor Kitchen",
];

// Helper function to validate decimal input (only whole numbers and halves)
const validateDecimalInput = (text: string): number | undefined => {
  if (text === "") return undefined;

  // Allow intermediate states like "4." or "4.5" during typing
  const num = parseFloat(text);
  if (isNaN(num)) return undefined;

  // Check if the number divides by 0.5 (meaning it's a whole number or half)
  const dividedByHalf = num / 0.5;
  if (Number.isInteger(dividedByHalf)) {
    return num;
  }

  return undefined;
};

export default function BasicDetailsStep({ data, onUpdate }: StepProps) {
  const [bedroomInputText, setBedroomInputText] = useState(
    data.customBedrooms?.toString() || ""
  );
  const [bathroomInputText, setBathroomInputText] = useState(
    data.customBathrooms?.toString() || ""
  );
  const [bedroomError, setBedroomError] = useState<string | undefined>(
    undefined
  );
  const [bathroomError, setBathroomError] = useState<string | undefined>(
    undefined
  );
  const [showAdditionalRooms, setShowAdditionalRooms] = useState(false);

  // Sync local state with data when it changes from outside
  useEffect(() => {
    setBedroomInputText(data.customBedrooms?.toString() || "");
    setBedroomError(undefined); // Clear error when data changes
  }, [data.customBedrooms]);

  useEffect(() => {
    setBathroomInputText(data.customBathrooms?.toString() || "");
    setBathroomError(undefined); // Clear error when data changes
  }, [data.customBathrooms]);

  const handleBedroomInputChange = (text: string) => {
    setBedroomInputText(text);

    // Only validate and update if the text represents a complete valid number
    if (text === "") {
      onUpdate({ customBedrooms: undefined });
      setBedroomError(undefined);
    } else {
      const numValue = validateDecimalInput(text);
      if (numValue !== undefined) {
        onUpdate({ customBedrooms: numValue });
        setBedroomError(undefined);
      } else {
        // Check if it's a complete number (not just typing)
        const num = parseFloat(text);
        if (
          !isNaN(num) &&
          text.includes(".") &&
          text.split(".")[1]?.length > 0
        ) {
          setBedroomError(
            "Only whole numbers and halves (e.g., 4, 4.5) are allowed"
          );
        } else {
          setBedroomError(undefined);
        }
      }
    }
  };

  const handleBathroomInputChange = (text: string) => {
    setBathroomInputText(text);

    // Only validate and update if the text represents a complete valid number
    if (text === "") {
      onUpdate({ customBathrooms: undefined });
      setBathroomError(undefined);
    } else {
      const numValue = validateDecimalInput(text);
      if (numValue !== undefined) {
        onUpdate({ customBathrooms: numValue });
        setBathroomError(undefined);
      } else {
        // Check if it's a complete number (not just typing)
        const num = parseFloat(text);
        if (
          !isNaN(num) &&
          text.includes(".") &&
          text.split(".")[1]?.length > 0
        ) {
          setBathroomError(
            "Only whole numbers and halves (e.g., 3, 3.5) are allowed"
          );
        } else {
          setBathroomError(undefined);
        }
      }
    }
  };

  const handleRoomToggle = (room: string, isSelected: boolean) => {
    const currentRooms = data.additionalRooms || [];
    if (isSelected) {
      // Add room if not already present
      if (!currentRooms.includes(room)) {
        onUpdate({ additionalRooms: [...currentRooms, room] });
      }
    } else {
      // Remove room
      onUpdate({ additionalRooms: currentRooms.filter((r) => r !== room) });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic Details</Text>
      <Text style={styles.subtitle}>
        Tell renters about your property's features
      </Text>

      <Card style={styles.inputCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bedrooms</Text>
          <View style={styles.chipContainer}>
            {[1, 2, 3, 4].map((count) => (
              <Chip
                key={count}
                label={count === 4 ? "Other" : count.toString()}
                selected={data.bedrooms === count}
                onPress={() => onUpdate({ bedrooms: count })}
                variant="primary"
              />
            ))}
          </View>
          {data.bedrooms === 4 && (
            <View style={styles.customInputContainer}>
              <Input
                label="Number of bedrooms"
                placeholder="Enter number of bedrooms (e.g., 4, 4.5)"
                value={bedroomInputText}
                onChangeText={handleBedroomInputChange}
                keyboardType="numeric"
                error={bedroomError}
                style={styles.customInput}
              />
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Do you have a living room?</Text>
          <View style={styles.chipContainer}>
            <Chip
              label="Yes"
              selected={data.isOneBedroomLivingRoom === true}
              onPress={() => onUpdate({ isOneBedroomLivingRoom: true })}
              variant="primary"
            />
            <Chip
              label="No"
              selected={data.isOneBedroomLivingRoom === false}
              onPress={() => onUpdate({ isOneBedroomLivingRoom: false })}
              variant="primary"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bathrooms</Text>
          <View style={styles.chipContainer}>
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
          {data.bathrooms === 3 && (
            <View style={styles.customInputContainer}>
              <Input
                label="Number of bathrooms"
                placeholder="Enter number of bathrooms (e.g., 3, 3.5)"
                value={bathroomInputText}
                onChangeText={handleBathroomInputChange}
                keyboardType="numeric"
                error={bathroomError}
                style={styles.customInput}
              />
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Kitchen, Balcony, Garden & Pantry
          </Text>
          <Text style={styles.inputSubtext}>
            Select all available in your property
          </Text>
          <View style={styles.roomOptionsContainer}>
            {SPECIFIC_ROOMS.map((room) => (
              <View key={room} style={styles.roomOption}>
                <Toggle
                  value={data.additionalRooms?.includes(room) || false}
                  onValueChange={(isSelected) =>
                    handleRoomToggle(room, isSelected)
                  }
                  size="sm"
                />
                <Text style={styles.roomOptionLabel}>{room}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.additionalRoomsHeader}>
            <Text style={styles.inputLabel}>Additional Rooms</Text>
            <Chip
              label={showAdditionalRooms ? "Hide" : "Show"}
              selected={false}
              onPress={() => setShowAdditionalRooms(!showAdditionalRooms)}
              variant="secondary"
            />
          </View>
          {showAdditionalRooms && (
            <>
              <Text style={styles.inputSubtext}>
                Select all additional rooms available in your property
              </Text>
              <View style={styles.roomOptionsContainer}>
                {ADDITIONAL_ROOMS.map((room) => (
                  <View key={room} style={styles.roomOption}>
                    <Toggle
                      value={data.additionalRooms?.includes(room) || false}
                      onValueChange={(isSelected) =>
                        handleRoomToggle(room, isSelected)
                      }
                      size="sm"
                    />
                    <Text style={styles.roomOptionLabel}>{room}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Renovation Status</Text>
          <View style={styles.chipContainer}>
            <Chip
              label="✨ New"
              selected={data.renovation === "new"}
              onPress={() => onUpdate({ renovation: "new" })}
              variant="primary"
            />
            <Chip
              label="🛠️ Renovated"
              selected={data.renovation === "renovated"}
              onPress={() => onUpdate({ renovation: "renovated" })}
              variant="primary"
            />
            <Chip
              label="🏚️ Needs work"
              selected={data.renovation === "needs_work"}
              onPress={() => onUpdate({ renovation: "needs_work" })}
              variant="primary"
            />
          </View>
        </View>

        <SizeInput
          label="Size"
          value={data.size}
          onValueChange={(value) => onUpdate({ size: value })}
          minimumValue={30}
          maximumValue={500}
          unit="m²"
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
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
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  customInputContainer: {
    marginTop: spacing.md,
  },
  customInput: {
    marginBottom: 0,
  },
  inputSubtext: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  roomOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  roomOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    minWidth: "45%",
  },
  roomOptionLabel: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
  additionalRoomsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
});
