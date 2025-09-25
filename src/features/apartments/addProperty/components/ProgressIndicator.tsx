import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
} from "../../../../shared/constants/tokens";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  steps,
}: ProgressIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        {steps.map((_, index) => (
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
        Step {currentStep + 1} of {totalSteps}: {steps[currentStep]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
