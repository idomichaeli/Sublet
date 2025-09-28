import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
} from "../../../shared/constants/tokens";

export interface RenterCardProps {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  profileImage: string;
  isVerified: boolean;
  propertyTitle: string;
  propertyImage: string;
  budget: string;
  moveInDate: string;
  messagePreview: string;
  status: "pending" | "accepted" | "rejected";
  ownerPrice: number; // Owner's asking price per month
  renterSuggestedPrice: number; // Renter's suggested price per month
  startDate: string; // Rental start date
  endDate: string; // Rental end date
  onAccept?: () => void;
  onReject?: () => void;
  onChatPress?: () => void;
  onPress?: () => void;
  style?: any;
}

export default function RenterCard({
  id,
  name,
  age,
  occupation,
  location,
  profileImage,
  isVerified,
  propertyTitle,
  propertyImage,
  budget,
  moveInDate,
  messagePreview,
  status,
  ownerPrice,
  renterSuggestedPrice,
  startDate,
  endDate,
  onAccept,
  onReject,
  onChatPress,
  onPress,
  style,
}: RenterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  // Calculate price difference and weekly/daily rates from monthly price
  const priceDifference = renterSuggestedPrice - ownerPrice;
  const weeklyRate = renterSuggestedPrice / 4.33; // Monthly price divided by weeks per month
  const dailyRate = renterSuggestedPrice / 30; // Monthly price divided by days per month

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const gestureHandler = {
    onStart: () => {
      scale.value = withSpring(0.98);
    },
    onActive: (event: any) => {
      translateX.value = event.translationX;
    },
    onEnd: (event: any) => {
      scale.value = withSpring(1);

      if (event.translationX > 100) {
        // Swipe right = Accept
        translateX.value = withSpring(300, {}, () => {
          runOnJS(handleAccept)();
        });
      } else if (event.translationX < -100) {
        // Swipe left = Reject
        translateX.value = withSpring(-300, {}, () => {
          runOnJS(handleReject)();
        });
      } else {
        // Return to center
        translateX.value = withSpring(0);
      }
    },
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const getStatusVariant = () => {
    switch (status) {
      case "accepted":
        return "available";
      case "rejected":
        return "unavailable";
      case "pending":
      default:
        return "pending";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "pending":
      default:
        return "Pending";
    }
  };

  return (
    <View style={[styles.container, style]}>
      <PanGestureHandler onGestureEvent={gestureHandler as any}>
        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.backgroundGradient}>
            <TouchableOpacity
              style={styles.content}
              onPress={toggleExpansion}
              activeOpacity={0.8}
            >
              <View style={styles.header}>
                <View style={styles.renterInfo}>
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                  <View style={styles.renterDetails}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>
                        {name}, {age}
                      </Text>
                      {isVerified && <Text style={styles.verifiedIcon}>✓</Text>}
                    </View>
                    <Text style={styles.subtitle}>
                      {occupation} - {location}
                    </Text>
                    <View style={styles.offerInfo}>
                      <Text style={styles.offerPrice}>
                        ${renterSuggestedPrice}/month
                      </Text>
                      <Text style={styles.offerDates}>
                        {startDate} - {endDate}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {!isExpanded && (
                <View style={styles.pressForMoreContainer}>
                  <View style={styles.pressForMoreContent}>
                    <Text style={styles.pressForMoreText}>See more</Text>
                  </View>
                </View>
              )}

              {isExpanded && (
                <>
                  {/* Price Information */}
                  <View style={styles.priceSection}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Suggested Price:</Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceValue}>
                          ${renterSuggestedPrice}
                          {priceDifference > 0 ? (
                            <Text style={styles.priceIncrease}>
                              {" "}
                              +${priceDifference}
                            </Text>
                          ) : priceDifference < 0 ? (
                            <Text style={styles.priceDecrease}>
                              {" "}
                              ${priceDifference}
                            </Text>
                          ) : (
                            <Text style={styles.priceEqual}>
                              {" "}
                              =${ownerPrice}
                            </Text>
                          )}
                        </Text>
                        <Text style={styles.priceCalculations}>
                          ${Math.round(weeklyRate)}/week • $
                          {Math.round(dailyRate)}
                          /day
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Date Information */}
                  <View style={styles.dateSection}>
                    <View style={styles.dateRow}>
                      <Text style={styles.dateLabel}>Offered Start:</Text>
                      <View style={styles.dateContainer}>
                        <View style={styles.dateComparison}>
                          <Text style={styles.originalDate}>18/1</Text>
                          <Text style={styles.arrow}>→</Text>
                          <Text style={styles.dateValue}>{startDate}</Text>
                        </View>
                        <Text style={styles.dateDifference}>
                          {startDate === "Jan 15" ? "-3 days" : "+3 days"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dateRow}>
                      <Text style={styles.dateLabel}>Offered End:</Text>
                      <View style={styles.dateContainer}>
                        <View style={styles.dateComparison}>
                          <Text style={styles.originalDate}>15/12</Text>
                          <Text style={styles.arrow}>→</Text>
                          <Text style={styles.dateValue}>{endDate}</Text>
                        </View>
                        <Text style={styles.dateDifference}>
                          {endDate === "Dec 16" ? "-1 day" : "+1 day"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.messageSection}>
                    <Text style={styles.messageLabel}>Message:</Text>
                    <Text style={styles.messagePreview} numberOfLines={2}>
                      {messagePreview}
                    </Text>
                  </View>

                  {status === "pending" && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={onAccept}
                      >
                        <Text style={styles.actionIcon}>💬</Text>
                        <Text style={styles.actionText}>Let's Talk!</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.counterOfferButton]}
                        onPress={onChatPress}
                      >
                        <Text style={styles.actionText}>Counter Offer</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={onReject}
                      >
                        <Text style={styles.actionIcon}>🗑️</Text>
                        <Text style={styles.actionText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
      {/* Separator line with shadow */}
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    marginHorizontal: 0,
    marginTop: 0,
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    shadowColor: colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderColor: colors.neutral[100],
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    shadowColor: colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
    padding: spacing.xs,
    backgroundColor: "transparent",
    borderRadius: borderRadius.md,
  },
  renterInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.neutral[200],
    marginRight: spacing.sm,
  },
  renterDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  name: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginRight: spacing.xs,
    fontWeight: "bold",
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  verifiedIcon: {
    fontSize: 16,
    color: colors.primary[500],
  },
  offerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  offerPrice: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "600",
  },
  offerDates: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 12,
  },
  messageSection: {
    marginBottom: spacing.sm,
    padding: spacing.xs,
    backgroundColor: "#F8F9FA",
    borderRadius: borderRadius.md,
    borderLeftWidth: 0,
  },
  messageLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  messagePreview: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontStyle: "italic",
  },
  pressForMoreContainer: {
    alignItems: "center",
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },
  pressForMoreContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  pressForMoreIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  pressForMoreText: {
    ...textStyles.caption,
    color: colors.primary[500],
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  acceptButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#28A745",
  },
  chatButton: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.primary[500],
  },
  rejectButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DC3545",
  },
  counterOfferButton: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.warning[500],
  },
  deleteButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DC3545",
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    ...textStyles.caption,
    fontWeight: "500",
  },
  priceSection: {
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: "#F8F9FA",
    borderRadius: borderRadius.lg,
    borderWidth: 0,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  priceLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "500",
    flex: 1,
  },
  priceContainer: {
    flex: 2,
    alignItems: "flex-end",
  },
  priceValue: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  priceIncrease: {
    color: colors.success[600],
    fontSize: 14,
    fontWeight: "500",
  },
  priceDecrease: {
    color: colors.error[600],
    fontSize: 14,
    fontWeight: "500",
  },
  priceEqual: {
    color: colors.neutral[600],
    fontSize: 14,
    fontWeight: "500",
  },
  priceCalculations: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontSize: 11,
  },
  dateSection: {
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: "#F8F9FA",
    borderRadius: borderRadius.lg,
    borderWidth: 0,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  dateLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "500",
    flex: 1,
  },
  dateContainer: {
    flex: 2,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  dateValue: {
    ...textStyles.caption,
    color: colors.neutral[900],
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  dateChange: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontSize: 11,
  },
  originalDate: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontSize: 14,
    fontWeight: "400",
    textDecorationLine: "line-through",
  },
  dateComparison: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: spacing.xs,
  },
  arrow: {
    fontSize: 12,
    color: colors.neutral[400],
    marginHorizontal: spacing.xs,
  },
  dateDifference: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontSize: 9,
    fontWeight: "400",
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: 0,
    borderRadius: 1,
  },
});
