import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { colors, spacing, textStyles, borderRadius } from "../constants/tokens";
import renterOfferSubmission from "../../core/services/renterOfferSubmission";

interface OfferSubmissionFormProps {
  propertyData: {
    id: string;
    title: string;
    image: string;
    ownerId: string;
    ownerPrice: number;
    ownerStartDate: string;
    ownerEndDate: string;
  };
  userInfo: {
    id: string;
    name: string;
    age: number;
    occupation: string;
    location: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  ownerInfo: {
    name: string;
  };
  onOfferSubmitted?: (success: boolean) => void;
}

/**
 * Offer submission form component for renters
 * Allows renters to submit offers with price, dates, and notes
 */
export default function OfferSubmissionForm({
  propertyData,
  userInfo,
  ownerInfo,
  onOfferSubmitted,
}: OfferSubmissionFormProps) {
  const [offerPrice, setOfferPrice] = useState<string>(
    propertyData.ownerPrice.toString()
  );
  const [startDate, setStartDate] = useState<string>(
    propertyData.ownerStartDate
  );
  const [endDate, setEndDate] = useState<string>(propertyData.ownerEndDate);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate recommended offer prices
  const preferences = renterOfferSubmission.calculatePriceRecommendations(
    propertyData.ownerPrice
  );

  const handleSubmit = async () => {
    if (!offerPrice || !startDate || !endDate) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const offerAmount = parseInt(offerPrice);
    if (isNaN(offerAmount) || offerAmount <= 0) {
      Alert.alert("Error", "Please enter a valid offer amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await renterOfferSubmission.submitOffer(
        propertyData,
        {
          offerPrice: offerAmount,
          startDate,
          endDate,
          note: note.trim(),
        },
        userInfo,
        ownerInfo
      );

      if (result.success) {
        Alert.alert(
          "Success!",
          "Your offer has been submitted successfully and sent to the owner's inbox.",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form
                setOfferPrice(propertyData.ownerPrice.toString());
                setStartDate(propertyData.ownerStartDate);
                setEndDate(propertyData.ownerEndDate);
                setNote("");
                onOfferSubmitted?.(true);
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", result.message || "Failed to submit offer");
        onOfferSubmitted?.(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit offer. Please try again.");
      onOfferSubmitted?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setRecommendedPrice = (price: number) => {
    setOfferPrice(price.toString());
  };

  const formatOfferSummary = () => {
    if (!offerPrice || !startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    return {
      formattedPrice: `$${offerPrice}/month`,
      formattedDateRange: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      duration: `${duration} months`,
      weeklyRate: Math.round(parseInt(offerPrice) / 4.33),
      totalAmount: parseInt(offerPrice) * duration,
    };
  };

  const offerSummary = formatOfferSummary();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{propertyData.title}</Text>
          <Text style={styles.propertyPrice}>
            Owner's asking price: {propertyData.ownerPrice}/month
          </Text>
        </View>

        {/* Recommendation Buttons */}
        <View style={styles.recommendationSection}>
          <Text style={styles.sectionTitle}>Offer Suggestions</Text>
          <View style={styles.recommendationButtons}>
            <TouchableOpacity
              style={[styles.recommendationButton, styles.conservativeButton]}
              onPress={() => setRecommendedPrice(preferences.conservative)}
            >
              <Text style={styles.recommendationButtonText}>
                Conservative{"\n"}${preferences.conservative}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recommendationButton, styles.listingButton]}
              onPress={() => setRecommendedPrice(preferences.listingPrice)}
            >
              <Text style={styles.recommendationButtonText}>
                At Listing{"\n"}${preferences.listingPrice}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recommendationButton, styles.competitiveButton]}
              onPress={() => setRecommendedPrice(preferences.competitive)}
            >
              <Text style={styles.recommendationButtonText}>
                Competitive{"\n"}${preferences.competitive}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Offer Amount */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Your Offer Price (per month)</Text>
          <TextInput
            style={styles.priceInput}
            value={offerPrice}
            onChangeText={setOfferPrice}
            placeholder="Enter your offer amount"
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>

        {/* Rental Dates */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Preferred Start Date</Text>
          <TextInput
            style={styles.dateInput}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD (e.g., 2024-02-01)"
            returnKeyType="done"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Preferred End Date</Text>
          <TextInput
            style={styles.dateInput}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD (e.g., 2024-11-30)"
            returnKeyType="done"
          />
        </View>

        {/* Offer Summary */}
        {offerSummary && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Offer Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Monthly Rent:</Text>
                <Text style={styles.summaryValue}>
                  {offerSummary.formattedPrice}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration:</Text>
                <Text style={styles.summaryValue}>{offerSummary.duration}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={styles.summaryValue}>
                  ${offerSummary.totalAmount}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Weekly Rate:</Text>
                <Text style={styles.summaryValue}>
                  ${offerSummary.weeklyRate}/week
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Note */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Message to Owner (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Tell me the owner why you'd be a great tenant..."
            multiline
            numberOfLines={4}
            maxLength={500}
            returnKeyType="done"
          />
          <Text style={styles.charCounter}>{note.length}/500 characters</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Submitting Offer..." : "Submit Offer"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    padding: spacing.lg,
  },
  propertyInfo: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  propertyTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  propertyPrice: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "600",
  },
  recommendationSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  recommendationButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  recommendationButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    borderWidth: 1,
  },
  conservativeButton: {
    backgroundColor: colors.neutral[50],
    borderColor: colors.neutral[300],
  },
  listingButton: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[300],
  },
  competitiveButton: {
    backgroundColor: colors.success[50],
    borderColor: colors.success[300],
  },
  recommendationButtonText: {
    ...textStyles.body,
    textAlign: "center",
    fontWeight: "600",
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  priceInput: {
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 18,
    fontWeight: "600",
    color: colors.neutral[900],
  },
  dateInput: {
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.neutral[900],
  },
  summarySection: {
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  summaryValue: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  noteInput: {
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.neutral[900],
    textAlignVertical: "top",
    minHeight: 100,
  },
  charCounter: {
    ...textStyles.caption,
    color: colors.neutral[500],
    textAlign: "right",
    marginTop: spacing.xs,
  },
  submitButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  submitButtonDisabled: {
    backgroundColor: colors.neutral[400],
  },
  submitButtonText: {
    ...textStyles.h4,
    color: colors.neutral[0],
    fontWeight: "600",
  },
});
