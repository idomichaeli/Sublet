import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
} from "../../../shared/constants/tokens";

export interface SizeInputProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  unit?: string;
  label?: string;
  disabled?: boolean;
  style?: any;
}

export default function SizeInput({
  value,
  onValueChange,
  minimumValue = 30,
  maximumValue = 500,
  unit = "m²",
  label,
  disabled = false,
  style,
}: SizeInputProps) {
  const [inputText, setInputText] = useState(value.toString());
  const [error, setError] = useState<string | undefined>(undefined);

  // Sync local state with value when it changes from outside
  useEffect(() => {
    setInputText(value.toString());
    setError(undefined);
  }, [value]);

  const handleDecrease = () => {
    const newValue = Math.max(minimumValue, value - 5);
    onValueChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(maximumValue, value + 5);
    onValueChange(newValue);
  };

  const handleInputChange = (text: string) => {
    setInputText(text);

    // Allow empty input during typing
    if (text === "") {
      setError(undefined);
      return;
    }

    // Validate that it's a number
    const numValue = parseFloat(text);
    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return;
    }

    // Check if it's within bounds
    if (numValue < minimumValue) {
      setError(`Minimum value is ${minimumValue}${unit}`);
      return;
    }

    if (numValue > maximumValue) {
      setError(`Maximum value is ${maximumValue}${unit}`);
      return;
    }

    // If valid, update the value and clear error
    onValueChange(numValue);
    setError(undefined);
  };

  const handleInputBlur = () => {
    // If input is empty or invalid, reset to current value
    if (inputText === "" || error) {
      setInputText(value.toString());
      setError(undefined);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, disabled && styles.disabled]}
          onPress={handleDecrease}
          disabled={disabled || value <= minimumValue}
        >
          <Text style={styles.controlText}>−</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              error && styles.inputError,
              { color: disabled ? colors.neutral[500] : colors.neutral[900] },
            ]}
            value={inputText}
            onChangeText={handleInputChange}
            onBlur={handleInputBlur}
            keyboardType="numeric"
            editable={!disabled}
            placeholder={minimumValue.toString()}
            placeholderTextColor={colors.neutral[500]}
          />
          <Text style={styles.unitText}>{unit}</Text>
        </View>

        <TouchableOpacity
          style={[styles.controlButton, disabled && styles.disabled]}
          onPress={handleIncrease}
          disabled={disabled || value >= maximumValue}
        >
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
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
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  disabled: {
    opacity: 0.5,
  },
  controlText: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.md,
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    flex: 1,
    maxWidth: 120,
  },
  input: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    paddingVertical: spacing.sm,
    minWidth: 40,
  },
  inputError: {
    borderColor: colors.error[500],
  },
  unitText: {
    ...textStyles.caption,
    color: colors.neutral[500],
    marginLeft: spacing.xs,
  },
  errorText: {
    ...textStyles.caption,
    color: colors.error[500],
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
