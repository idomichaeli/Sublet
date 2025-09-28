import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, Modal, Animated } from "react-native";
import { useAuthStore } from "../../../core/services/authenticationStore";
import { colors, spacing } from "../../../shared/constants/tokens";
import PropertyOwnerHomeHeader from "../components/PropertyOwnerHomeHeader";
import PropertyOwnerStatusSummary from "../components/PropertyOwnerStatusSummary";
import PropertyOwnerQuickActions from "../components/PropertyOwnerQuickActions";
import PropertyOwnerStats from "../components/PropertyOwnerStats";
import PropertyOwnerAnalytics from "../components/PropertyOwnerAnalytics";
import PropertyOwnerPropertiesList from "../components/PropertyOwnerPropertiesList";

export default function PropertyOwnerHomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showAnalyticsDetails, setShowAnalyticsDetails] = useState(false);
  const [selectedAnalytic, setSelectedAnalytic] = useState<any>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const handleAddProperty = () => {
    navigation.navigate("AddProperty");
  };

  const handleEditProperty = (propertyId: string) => {
    navigation.navigate("EditProperty", { propertyId });
  };

  const handleViewRenters = (propertyId: string) => {
    navigation.navigate("InterestedRenters", { propertyId });
  };

  const handleDeleteProperty = (propertyId: string) => {
    // Handle property deletion
    console.log("Delete property:", propertyId);
  };

  const handleToggleCardExpansion = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handlePropertyPress = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setShowPropertyDetails(true);
  };

  const handleAnalyticsPress = (analytic: any) => {
    setSelectedAnalytic(analytic);
    setShowAnalyticsDetails(true);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Mock data - in real app, this would come from API
  const statusSummary = {
    totalProperties: 3,
    availableProperties: 1,
    bookedProperties: 1,
    draftProperties: 1,
    totalViews: 217,
    totalInterests: 38,
  };

  const quickActions = [
    {
      id: "1",
      title: "Add Property",
      icon: "🏠",
      color: colors.primary[500],
      onPress: handleAddProperty,
    },
    {
      id: "2",
      title: "View Bookings",
      icon: "📅",
      color: colors.success[500],
      badge: "3",
      onPress: () => navigation.navigate("Bookings"),
    },
    {
      id: "3",
      title: "Messages",
      icon: "💬",
      color: colors.warning[500],
      badge: "5",
      onPress: () => navigation.navigate("Chat"),
    },
    {
      id: "4",
      title: "Analytics",
      icon: "📊",
      color: colors.primary[500],
      onPress: () => setShowAnalyticsDetails(true),
    },
  ];

  const stats = [
    {
      title: "Monthly Revenue",
      value: "$2,400",
      change: "+12%",
      color: colors.success[500],
      icon: "💰",
    },
    {
      title: "Occupancy Rate",
      value: "85%",
      change: "+5%",
      color: colors.primary[500],
      icon: "📈",
    },
    {
      title: "Avg Rating",
      value: "4.7",
      change: "+0.2",
      color: colors.warning[500],
      icon: "⭐",
    },
    {
      title: "New Inquiries",
      value: "12",
      change: "+3",
      color: colors.primary[500],
      icon: "📧",
    },
  ];

  const analytics = [
    {
      id: "1",
      title: "Views This Month",
      value: "1,247",
      change: "+23%",
      color: colors.primary[500],
      icon: "👁️",
    },
    {
      id: "2",
      title: "Booking Rate",
      value: "68%",
      change: "+8%",
      color: colors.success[500],
      icon: "📊",
    },
    {
      id: "3",
      title: "Response Time",
      value: "2.3h",
      change: "-0.5h",
      color: colors.warning[500],
      icon: "⏱️",
    },
  ];

  const properties = [
    {
      id: "1",
      title: "Cozy Apartment, Tel Aviv",
      location: "Tel Aviv, Israel",
      imageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      status: "available" as const,
      views: 128,
      interests: 23,
      price: 150,
      rating: 4.8,
      nextBooking: "Dec 20-25",
    },
    {
      id: "2",
      title: "Modern Studio, Haifa",
      location: "Haifa, Israel",
      imageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      status: "booked" as const,
      views: 89,
      interests: 15,
      price: 120,
      rating: 4.6,
      nextBooking: "Currently booked",
    },
    {
      id: "3",
      title: "Luxury Penthouse, Jerusalem",
      location: "Jerusalem, Israel",
      imageUrl:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      status: "draft" as const,
      views: 0,
      interests: 0,
      price: 300,
      rating: 0,
      nextBooking: "Not published",
    },
  ];

  const closePropertyDetails = () => {
    setShowPropertyDetails(false);
    setSelectedProperty(null);
  };

  const closeAnalyticsDetails = () => {
    setShowAnalyticsDetails(false);
    setSelectedAnalytic(null);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <PropertyOwnerHomeHeader user={user} onAddProperty={handleAddProperty} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <PropertyOwnerStatusSummary statusSummary={statusSummary} />
          <PropertyOwnerQuickActions quickActions={quickActions} />
          <PropertyOwnerStats stats={stats} />
          <PropertyOwnerAnalytics
            analytics={analytics}
            onAnalyticsPress={handleAnalyticsPress}
          />
          <PropertyOwnerPropertiesList
            properties={properties}
            expandedCards={expandedCards}
            onPropertyPress={handlePropertyPress}
            onEditProperty={handleEditProperty}
            onViewRenters={handleViewRenters}
            onDeleteProperty={handleDeleteProperty}
            onToggleCardExpansion={handleToggleCardExpansion}
          />
        </View>
      </ScrollView>

      {/* Property Details Modal */}
      <Modal
        visible={showPropertyDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closePropertyDetails}
      >
        <View style={styles.modalContainer}>
          {/* Modal content would go here */}
        </View>
      </Modal>

      {/* Analytics Details Modal */}
      <Modal
        visible={showAnalyticsDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAnalyticsDetails}
      >
        <View style={styles.modalContainer}>
          {/* Modal content would go here */}
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.lg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
  },
});
