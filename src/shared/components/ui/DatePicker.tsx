import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../constants/tokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CALENDAR_WIDTH = SCREEN_WIDTH - spacing.lg * 2;

interface DatePickerProps {
  label: string;
  value: string;
  onDateChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD format
  maxDate?: string; // YYYY-MM-DD format
  placeholder?: string;
  style?: any;
}

export default function DatePicker({
  label,
  value,
  onDateChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  style,
}: DatePickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    // If we have a selected value, show that month
    if (value) {
      return new Date(value + "T00:00:00");
    }
    // Otherwise show current month or minDate if available
    if (minDate) {
      return new Date(minDate + "T00:00:00");
    }
    return new Date();
  });

  // Update current month when value changes
  useEffect(() => {
    if (value) {
      const selectedDate = new Date(value + "T00:00:00");
      setCurrentMonth(selectedDate);
    }
  }, [value]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00");
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    const dateString = formatDate(date);
    const today = formatDate(new Date());

    // Disable dates before today (for booking purposes)
    if (dateString < today) return true;

    // Disable dates outside the available range
    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    return formatDate(date) === value;
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      onDateChange(formatDate(date));
      setIsVisible(false);
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isDisabled = isDateDisabled(date);
      const isSelected = isDateSelected(date);
      const isToday = formatDate(date) === formatDate(new Date());

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
          ]}
          onPress={() => handleDateSelect(date)}
          disabled={isDisabled}
        >
          <Text
            style={[
              styles.dayText,
              isDisabled && styles.disabledDayText,
              isSelected && styles.selectedDayText,
              isToday && !isSelected && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const getMonthYearString = () => {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.input} onPress={() => setIsVisible(true)}>
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value
            ? new Date(value + "T00:00:00").toLocaleDateString()
            : placeholder}
        </Text>
        <Text style={styles.arrow}>📅</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth("prev")}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.monthYear}>{getMonthYearString()}</Text>

              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth("next")}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendar}>
              {/* Day headers */}
              <View style={styles.dayHeaders}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <Text key={day} style={styles.dayHeader}>
                      {day}
                    </Text>
                  )
                )}
              </View>

              {/* Days grid */}
              <View style={styles.daysGrid}>{renderCalendar()}</View>
            </View>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
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
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[0],
  },
  inputText: {
    ...textStyles.body,
    color: colors.neutral[900],
    flex: 1,
  },
  placeholderText: {
    color: colors.neutral[400],
  },
  arrow: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: withOpacity(colors.neutral[900], "50"),
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: CALENDAR_WIDTH,
    maxWidth: 350,
    ...shadows.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    ...textStyles.h3,
    color: colors.neutral[700],
    fontWeight: "600",
  },
  monthYear: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  calendar: {
    marginBottom: spacing.lg,
  },
  dayHeaders: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  dayHeader: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  dayText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  selectedDay: {
    backgroundColor: colors.primary[500],
    borderRadius: 20,
  },
  selectedDayText: {
    color: colors.neutral[0],
    fontWeight: "600",
  },
  todayDay: {
    backgroundColor: colors.primary[100],
    borderRadius: 20,
  },
  todayDayText: {
    color: colors.primary[700],
    fontWeight: "600",
  },
  disabledDayText: {
    color: colors.neutral[300],
  },
  closeButton: {
    backgroundColor: colors.neutral[100],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  closeButtonText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "600",
  },
});
