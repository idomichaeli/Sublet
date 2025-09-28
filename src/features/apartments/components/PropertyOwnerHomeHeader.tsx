import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";
import { LogoIcon } from "../../../shared/components/ui";

interface PropertyOwnerHomeHeaderProps {
  user: any;
  onAddProperty: () => void;
}

export default function PropertyOwnerHomeHeader({
  user,
  onAddProperty,
}: PropertyOwnerHomeHeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[colors.primary[600], colors.primary[500]]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <LogoIcon size={32} color={colors.neutral[0]} />
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddProperty}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>+ Add Property</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>
              {user?.name || "Property Owner"}
            </Text>
            <Text style={styles.subtitle}>
              Manage your properties and bookings
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary[600],
  },
  headerGradient: {
    paddingBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  addButtonText: {
    ...textStyles.button,
    color: colors.primary[600],
    fontWeight: "600",
  },
  welcomeSection: {
    marginTop: spacing.sm,
  },
  welcomeText: {
    ...textStyles.body,
    color: withOpacity(colors.neutral[0], "80"),
    marginBottom: spacing.xs,
  },
  userName: {
    ...textStyles.h2,
    color: colors.neutral[0],
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.caption,
    color: withOpacity(colors.neutral[0], "70"),
  },
});
