import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
} from "../../../shared/constants/tokens";

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  onLocationPress?: () => void;
  showFilterButton?: boolean;
  showLocationButton?: boolean;
  hasActiveFilters?: boolean;
  style?: any;
}

export default function SearchBar({
  placeholder = "Search apartments...",
  value,
  onChangeText,
  onSearchPress,
  onFilterPress,
  onLocationPress,
  showFilterButton = true,
  showLocationButton = false,
  hasActiveFilters = false,
  style,
}: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      {showLocationButton && (
        <TouchableOpacity
          style={styles.locationButton}
          onPress={onLocationPress}
        >
          <Text style={styles.locationIcon}>📍</Text>
        </TouchableOpacity>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[500]}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={onSearchPress}
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {showFilterButton && (
        <TouchableOpacity
          style={[
            styles.filterButton,
            hasActiveFilters && styles.filterButtonActive,
          ]}
          onPress={onFilterPress}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          {hasActiveFilters && <View style={styles.filterIndicator} />}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  locationButton: {
    backgroundColor: colors.secondary[500],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  locationIcon: {
    fontSize: 18,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    ...textStyles.body,
    color: colors.neutral[900],
    paddingVertical: spacing.md,
  },
  searchButton: {
    padding: spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
  },
  filterButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: colors.primary[600],
  },
  filterIcon: {
    fontSize: 18,
  },
  filterIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error[500],
  },
});
