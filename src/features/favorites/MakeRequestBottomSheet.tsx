import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRequestStore } from "../../shared/hooks/state/requestStore";
import { useAuthStore } from "../../shared/hooks/state/authStore";
import { SwipeCardData } from "../swipe/components/SwipeCard";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../shared/constants/tokens";
import Button from "../../shared/components/ui/Button";
import Input from "../../shared/components/ui/Input";
import BottomSheet from "../../shared/components/ui/BottomSheet";
import PriceScale from "../../shared/components/ui/PriceScale";
import DatePicker from "../../shared/components/ui/DatePicker";

interface MakeRequestBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  listing: SwipeCardData;
}

export default function MakeRequestBottomSheet({
  visible,
  onClose,
  listing,
}: MakeRequestBottomSheetProps) {
  const { user } = useAuthStore();
  const { add } = useRequestStore();

  const [counterOfferType, setCounterOfferType] = useState<
    "HIGHER" | "LOWER" | null
  >(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState("");
  const [counterOfferReason, setCounterOfferReason] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(listing.price);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle start date change - reset end date if it becomes invalid
  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    // If end date is before new start date, reset it
    if (endDate && newStartDate && endDate < newStartDate) {
      setEndDate("");
    }
  };

  // Default dates to owner's availability when sheet opens
  useEffect(() => {
    if (visible) {
      setSelectedPrice(listing.price);
      if (listing.availableFrom) {
        setStartDate(listing.availableFrom);
      }
      if (listing.availableTo) {
        setEndDate(listing.availableTo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, listing.id]);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to make a request");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        listingId: listing.id,
        renterId: user.id,
        ownerId: listing.ownerId || "mock-owner-id", // This should come from listing data in a real app
        counterOffer:
          selectedPrice !== listing.price
            ? {
                type: (selectedPrice > listing.price ? "HIGHER" : "LOWER") as
                  | "HIGHER"
                  | "LOWER",
                amount: selectedPrice,
                reason: counterOfferReason || undefined,
              }
            : undefined,
        preferredDates:
          startDate && endDate
            ? {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
              }
            : undefined,
        message: message || undefined,
      };

      const newRequest = await add(requestData);

      Alert.alert(
        "Request Sent!",
        "Your request has been sent to the property owner. You'll be notified when they respond.",
        [
          {
            text: "OK",
            onPress: () => {
              onClose();
              // Reset form
              setCounterOfferType(null);
              setCounterOfferAmount("");
              setCounterOfferReason("");
              setStartDate("");
              setEndDate("");
              setMessage("");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send request. Please try again.");
      console.error("Failed to create request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return startDate && endDate;
  };

  const handleClose = () => {
    // Reset form when closing
    setCounterOfferType(null);
    setCounterOfferAmount("");
    setCounterOfferReason("");
    setSelectedPrice(listing.price);
    setStartDate("");
    setEndDate("");
    setMessage("");
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title="Make an Offer"
      height={600}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>{listing.title}</Text>
        </View>

        {/* Price Scale */}
        <PriceScale
          ownerPrice={listing.price}
          onPriceChange={setSelectedPrice}
          initialPrice={selectedPrice}
        />

        {/* Counter Offer Reason */}
        {selectedPrice !== listing.price && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reason for Your Offer</Text>
            <Text style={styles.sectionDescription}>
              Why are you making this{" "}
              {selectedPrice > listing.price ? "higher" : "lower"} offer?
            </Text>

            <Input
              placeholder="Explain your reasoning for this price..."
              value={counterOfferReason}
              onChangeText={setCounterOfferReason}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Dates</Text>
          <Text style={styles.sectionDescription}>
            When would you like to stay at this property?
            {listing.availableFrom && listing.availableTo && (
              <Text style={styles.availabilityInfo}>
                {"\n"}Available:{" "}
                {new Date(
                  listing.availableFrom + "T00:00:00"
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(
                  listing.availableTo + "T00:00:00"
                ).toLocaleDateString()}
              </Text>
            )}
          </Text>

          <View style={styles.dateRow}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onDateChange={handleStartDateChange}
              minDate={listing.availableFrom}
              maxDate={listing.availableTo}
              placeholder="Start date"
              style={[styles.input, styles.dateInput]}
            />

            <DatePicker
              label="End Date"
              value={endDate}
              onDateChange={setEndDate}
              minDate={startDate || listing.availableFrom}
              maxDate={listing.availableTo}
              placeholder="End date"
              style={[styles.input, styles.dateInput]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message to Owner</Text>
          <Text style={styles.sectionDescription}>
            Add a personal message to the property owner (optional)
          </Text>

          <Input
            placeholder="Tell the owner why you're interested in their property..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
        </View>

        <View style={styles.submitContainer}>
          <Button
            title="Send Request"
            onPress={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            loading={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  counterOfferButtons: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  counterOfferButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral[0],
    alignItems: "center",
  },
  counterOfferButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  counterOfferButtonText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  counterOfferButtonTextSelected: {
    color: colors.primary[700],
    fontWeight: "600",
  },
  input: {
    marginBottom: spacing.md,
  },
  submitContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  availabilityInfo: {
    ...textStyles.caption,
    color: colors.primary[600],
    fontWeight: "500",
    marginTop: spacing.xs,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dateInput: {
    flex: 1,
    marginBottom: 0,
  },
});
