import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
} from "../../shared/constants/tokens";
import Input from "../../shared/components/ui/Input";
import Button from "../../shared/components/ui/Button";
import PriceScale from "../../shared/components/ui/PriceScale";
import DatePicker from "../../shared/components/ui/DatePicker";
import { SwipeCardData } from "../swipe/components/SwipeCard";

interface MakeRequestBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (requestData: {
    message: string;
    selectedPrice: number;
    startDate: string;
    endDate: string;
  }) => void;
  listing?: SwipeCardData;
}

export default function MakeRequestBottomSheet({
  visible,
  onClose,
  onSubmit,
  listing,
}: MakeRequestBottomSheetProps) {
  const [message, setMessage] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(listing?.price || 0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible && listing) {
      setSelectedPrice(listing.price);
      setStartDate("");
      setEndDate("");
      setMessage("");
    }
  }, [visible, listing]);

  const handleSubmit = () => {
    onSubmit({
      message,
      selectedPrice,
      startDate,
      endDate,
    });
    setMessage("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  const isFormValid = () => {
    return message.trim() && startDate && endDate;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Send Offer</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {listing && (
            <View style={styles.form}>
              <Text style={styles.propertyTitle}>{listing.title}</Text>

              {/* Price Scale */}
              <PriceScale
                ownerPrice={listing.price}
                onPriceChange={setSelectedPrice}
                initialPrice={selectedPrice}
              />

              {/* Date Selection */}
              <View style={styles.dateSection}>
                <Text style={styles.sectionTitle}>Preferred Dates</Text>
                <View style={styles.dateRow}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onDateChange={setStartDate}
                    placeholder="Select start date"
                    style={styles.dateInput}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onDateChange={setEndDate}
                    minDate={startDate}
                    placeholder="Select end date"
                    style={styles.dateInput}
                  />
                </View>
              </View>

              {/* Message Input */}
              <View style={styles.messageSection}>
                <Text style={styles.sectionTitle}>Message to Owner</Text>
                <Input
                  placeholder="Tell the owner why you're interested in this property..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  style={styles.messageInput}
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Send Request"
            onPress={handleSubmit}
            variant="primary"
            disabled={!isFormValid()}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  cancelButton: {
    ...textStyles.body,
    color: colors.primary[600],
  },
  title: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  form: {
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  propertyTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.lg,
    textAlign: "center",
    fontWeight: "600",
  },
  sectionTitle: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  dateSection: {
    marginBottom: spacing.lg,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dateInput: {
    flex: 1,
  },
  messageSection: {
    marginBottom: spacing.lg,
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
});
