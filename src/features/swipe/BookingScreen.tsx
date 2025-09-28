import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../shared/constants/tokens";
import { mockApartments } from "../../shared/data/mockApartments";

interface BookingScreenProps {
  route: {
    params: {
      listingId: string;
    };
  };
  navigation: any;
}

export default function BookingScreen({
  route,
  navigation,
}: BookingScreenProps) {
  const { listingId } = route.params;
  const listing = mockApartments.find((apt) => apt.id === listingId);

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Listing not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Apartment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listingCard}>
          <Text style={styles.listingTitle}>{listing.title}</Text>
          <Text style={styles.listingLocation}>📍 {listing.location}</Text>
          <Text style={styles.listingPrice}>₪{listing.price}/month</Text>
        </View>

        <View style={styles.bookingForm}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Check-in Date</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText}>Select Date</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Check-out Date</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText}>Select Date</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Number of Guests</Text>
            <View style={styles.guestSelector}>
              <TouchableOpacity style={styles.guestButton}>
                <Text style={styles.guestButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.guestCount}>1</Text>
              <TouchableOpacity style={styles.guestButton}>
                <Text style={styles.guestButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summary}>
            <Text style={styles.sectionTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Monthly Rent</Text>
              <Text style={styles.summaryValue}>₪{listing.price}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>
                ₪{Math.round(listing.price * 0.1)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₪{listing.price + Math.round(listing.price * 0.1)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    marginRight: spacing.md,
  },
  backButtonText: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "500",
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  listingCard: {
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  listingTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  listingLocation: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  listingPrice: {
    ...textStyles.h3,
    color: colors.primary[600],
    fontWeight: "600",
  },
  bookingForm: {
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.lg,
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  dateButton: {
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  dateButtonText: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  guestSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  guestButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
  },
  guestButtonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  guestCount: {
    ...textStyles.h3,
    color: colors.neutral[900],
    minWidth: 40,
    textAlign: "center",
  },
  summary: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  summaryValue: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "500",
  },
  totalRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  totalLabel: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  totalValue: {
    ...textStyles.h3,
    color: colors.primary[600],
    fontWeight: "600",
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  confirmButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  confirmButtonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    ...textStyles.h3,
    color: colors.neutral[600],
  },
});
