import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../../shared/constants/tokens";
import Card from "../../../../shared/components/ui/Card";
import Toggle from "../../../../shared/components/ui/Toggle";
import DateRangePicker, {
  DateRange,
} from "../../../../shared/components/ui/DateRangePicker";
import FlexibilityChipGroup, {
  FlexibilityOption,
} from "../../../../shared/components/ui/FlexibilityChipGroup";
import { PropertyAvailabilityObject } from "../../../../core/types/propertyObjects";

interface StepProps {
  data: PropertyAvailabilityObject;
  onUpdate: (updates: Partial<PropertyAvailabilityObject>) => void;
}

export default function AvailabilityStep({ data, onUpdate }: StepProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: data.availableFrom,
    endDate: data.availableTo,
  });

  // Animation values
  const fadeAnim = useSharedValue(1);
  const slideAnim = useSharedValue(0);

  // Update local state when data changes
  useEffect(() => {
    setDateRange({
      startDate: data.availableFrom,
      endDate: data.availableTo,
    });
  }, [data.availableFrom, data.availableTo]);

  // Handle date range change
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    onUpdate({
      availableFrom: range.startDate,
      availableTo: range.endDate,
    });
  };

  // Handle flexibility changes
  const handleStartFlexibilityChange = (flexibility: FlexibilityOption) => {
    onUpdate({ startDateFlexibility: flexibility });
  };

  const handleEndFlexibilityChange = (flexibility: FlexibilityOption) => {
    onUpdate({ endDateFlexibility: flexibility });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  // Calculate minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Calculate maximum date (1 year from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split("T")[0];
  };

  // Format flexibility display text
  const formatFlexibilityText = (flexibility?: FlexibilityOption) => {
    switch (flexibility) {
      case "exact":
        return "Exact Date";
      case "3days":
        return "±3 days";
      case "1week":
        return "±1 week";
      case "2weeks":
        return "±2 weeks";
      default:
        return "Not set";
    }
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.title, isDark && styles.darkTitle]}>
        Set Availability
      </Text>
      <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>
        Choose when the property is available and how flexible you are.
      </Text>

      <Card style={styles.inputCard}>
        {/* Date Range Selection */}
        <DateRangePicker
          label="Availability Period"
          value={dateRange}
          onDateRangeChange={handleDateRangeChange}
          minDate={getMinDate()}
          maxDate={getMaxDate()}
          style={styles.dateRangePicker}
        />

        {/* Flexibility Controls */}
        {dateRange.startDate && (
          <Animated.View
            style={[styles.flexibilitySection, animatedStyle]}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
          >
            <Text
              style={[styles.sectionTitle, isDark && styles.darkSectionTitle]}
            >
              Flexibility Settings
            </Text>

            {/* Start Date Flexibility */}
            <FlexibilityChipGroup
              label="Flexible Start?"
              value={data.startDateFlexibility}
              onValueChange={handleStartFlexibilityChange}
              style={styles.flexibilityGroup}
            />

            {/* End Date Flexibility */}
            {dateRange.endDate && (
              <FlexibilityChipGroup
                label="Flexible End?"
                value={data.endDateFlexibility}
                onValueChange={handleEndFlexibilityChange}
                style={styles.flexibilityGroup}
              />
            )}
          </Animated.View>
        )}

        {/* Preview Text */}
        {dateRange.startDate && (
          <Animated.View
            style={[styles.previewCard, isDark && styles.darkPreviewCard]}
            entering={FadeIn.duration(300)}
          >
            <Text
              style={[styles.previewTitle, isDark && styles.darkPreviewTitle]}
            >
              How renters will see this:
            </Text>
            <Text
              style={[styles.previewText, isDark && styles.darkPreviewText]}
            >
              {dateRange.startDate && (
                <>
                  Available around{" "}
                  {new Date(
                    dateRange.startDate + "T00:00:00"
                  ).toLocaleDateString()}
                  {data.startDateFlexibility &&
                    data.startDateFlexibility !== "exact" && (
                      <> ({formatFlexibilityText(data.startDateFlexibility)})</>
                    )}
                </>
              )}
              {dateRange.endDate && (
                <>
                  {" "}
                  until around{" "}
                  {new Date(
                    dateRange.endDate + "T00:00:00"
                  ).toLocaleDateString()}
                  {data.endDateFlexibility &&
                    data.endDateFlexibility !== "exact" && (
                      <> ({formatFlexibilityText(data.endDateFlexibility)})</>
                    )}
                </>
              )}
            </Text>
          </Animated.View>
        )}
      </Card>

      {/* Availability Tips */}
      <View style={[styles.tipsCard, isDark && styles.darkTipsCard]}>
        <Text style={[styles.tipsTitle, isDark && styles.darkTipsTitle]}>
          💡 Availability Tips:
        </Text>
        <Text style={[styles.tipsText, isDark && styles.darkTipsText]}>
          • Flexibility increases booking chances
        </Text>
        <Text style={[styles.tipsText, isDark && styles.darkTipsText]}>
          • Consider seasonal demand patterns
        </Text>
        <Text style={[styles.tipsText, isDark && styles.darkTipsText]}>
          • Update availability regularly
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: colors.dark.background,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  darkTitle: {
    color: colors.dark.onBackground,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  darkSubtitle: {
    color: colors.dark.onSurfaceVariant,
  },
  inputCard: {
    marginBottom: spacing.lg,
  },
  availableNowToggle: {
    marginBottom: spacing.lg,
  },
  dateRangePicker: {
    marginBottom: spacing.lg,
  },
  flexibilitySection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[800],
    marginBottom: spacing.md,
    fontWeight: "600",
  },
  darkSectionTitle: {
    color: colors.dark.onSurface,
  },
  flexibilityGroup: {
    marginBottom: spacing.md,
  },
  previewCard: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
    marginTop: spacing.lg,
  },
  darkPreviewCard: {
    backgroundColor: colors.primary[900],
    borderColor: colors.primary[800],
  },
  previewTitle: {
    ...textStyles.caption,
    color: colors.primary[700],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  darkPreviewTitle: {
    color: colors.primary[300],
  },
  previewText: {
    ...textStyles.body,
    color: colors.primary[800],
    fontWeight: "500",
  },
  darkPreviewText: {
    color: colors.primary[200],
  },
  tipsCard: {
    backgroundColor: colors.warning[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  darkTipsCard: {
    backgroundColor: colors.warning[900],
    borderColor: colors.warning[800],
  },
  tipsTitle: {
    ...textStyles.body,
    color: colors.warning[700],
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  darkTipsTitle: {
    color: colors.warning[300],
  },
  tipsText: {
    ...textStyles.caption,
    color: colors.warning[600],
    marginBottom: spacing.xs,
  },
  darkTipsText: {
    color: colors.warning[400],
  },
});
