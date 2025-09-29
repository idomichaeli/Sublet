import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../../core/services/authenticationStore";
import { useOwnerPropertyList } from "../../../core/services/ownerPropertyListManager";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../../shared/constants/tokens";
import {
  Card,
  Button,
  EmptyState,
  Tag,
  LogoIcon,
} from "../../../shared/components/ui";
import PropertyObjectCard from "../components/PropertyObjectCard";

const { width } = Dimensions.get("window");

export default function OwnerHomeScreen({ navigation, route }: any) {
  const { user } = useAuthStore();
  const ownerPropertyList = useOwnerPropertyList("current-owner");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Load properties from the property manager
  const loadProperties = async () => {
    try {
      // Force reload from storage to ensure we get the latest data
      if (ownerPropertyList.reloadFromStorage) {
        await ownerPropertyList.reloadFromStorage();
      }
      const publishedProperties = ownerPropertyList.getPublishedProperties();
      setProperties(publishedProperties);
    } catch (error) {
      console.error("Failed to load properties:", error);
      // Fallback to current data if reload fails
      const publishedProperties = ownerPropertyList.getPublishedProperties();
      setProperties(publishedProperties);
    }
  };

  // Load properties when component mounts
  useEffect(() => {
    loadProperties();
  }, []);

  // Refresh properties when screen comes into focus (e.g., returning from add property)
  useFocusEffect(
    React.useCallback(() => {
      loadProperties();

      // Show success message if property was just added
      if (route?.params?.propertyAdded) {
        // Clear the parameter to avoid showing the message again
        navigation.setParams({ propertyAdded: undefined });
      }
    }, [route?.params?.propertyAdded])
  );

  // Properties are now loaded from local storage only

  const handleAddProperty = () => {
    navigation.navigate("AddApartment");
  };

  const closePropertyDetails = () => {
    setShowPropertyDetails(false);
    setSelectedProperty(null);
  };

  // Quick actions for common tasks

  const handlePropertyPress = (property: any) => {
    // Navigate to property details screen
    navigation.navigate("PropertyDetails", { property });
  };

  const handleViewRenters = (propertyId: string) => {
    // Navigate to interested renters for this property
    navigation.navigate("InterestedRenters", { propertyId });
  };

  const handleDeleteProperty = (propertyId: string, propertyTitle: string) => {
    Alert.alert(
      "Delete Property",
      `Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await ownerPropertyList.deleteProperty(propertyId);
            if (result.success) {
              Alert.alert("Success", "Property deleted successfully");
              // Reload properties to update the UI
              loadProperties();
            } else {
              Alert.alert(
                "Error",
                result.errors?.join(", ") || "Failed to delete property"
              );
            }
          },
        },
      ]
    );
  };

  const renderProperty = ({ item }: { item: (typeof properties)[0] }) => {
    const propertyTitle = `${
      item.propertyCategory === "house" ? "House" : "Apartment"
    } • ${item.area?.name || "Tel Aviv"}`;

    return (
      <PropertyObjectCard
        property={item}
        status={item.status}
        views={item.views}
        interests={item.interests}
        rating={item.rating}
        nextBooking={item.nextBooking}
        onPress={() => handlePropertyPress(item)}
        onViewRentersPress={() => handleViewRenters(item.id)}
        onDeletePress={() => handleDeleteProperty(item.id, propertyTitle)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Add Property CTA */}
        <LinearGradient
          colors={[
            colors.primary[500],
            colors.primary[600],
            colors.primary[700],
          ]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View>
                <Text style={styles.heroGreeting}>
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </Text>
                <Text style={styles.heroSubtitle}>
                  Ready to grow your rental business?
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate("Profile")}
              >
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitial}>
                    {user?.name?.charAt(0) || "U"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Impressive Add Property Button */}
            <TouchableOpacity
              style={styles.addPropertyButton}
              onPress={handleAddProperty}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  colors.secondary[400],
                  colors.secondary[500],
                  colors.secondary[600],
                ]}
                style={styles.addPropertyGradient}
              >
                <View style={styles.addPropertyContent}>
                  <View style={styles.addPropertyIconContainer}>
                    <LogoIcon size={100} />
                  </View>
                  <View style={styles.addPropertyTextContainer}>
                    <Text style={styles.addPropertyTitle}>
                      Add New Property
                    </Text>
                    <Text style={styles.addPropertySubtitle}>
                      Start earning with your space
                    </Text>
                  </View>
                  <View style={styles.addPropertyArrow}>
                    <Text style={styles.addPropertyArrowIcon}>→</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.propertiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Properties</Text>
            <Button
              title="View All"
              onPress={() => navigation.navigate("MyProperties")}
              variant="tertiary"
              size="sm"
            />
          </View>

          {properties.length > 0 ? (
            <FlatList
              data={properties}
              renderItem={renderProperty}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={styles.propertiesList}
            />
          ) : (
            <EmptyState
              title="No Properties Yet"
              subtitle="Add your first property to start earning"
              actionLabel="Add Property"
              onActionPress={handleAddProperty}
              icon="🏠"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 120, // Extra padding for floating nav bar (80px height + 16px margin + 24px extra)
  },
  // Hero Section Styles
  heroSection: {
    paddingTop: spacing.lg,
    paddingBottom: spacing["2xl"],
    paddingHorizontal: spacing.lg,
  },
  heroContent: {
    flex: 1,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xl,
  },
  heroGreeting: {
    ...textStyles.h1,
    color: colors.neutral[0],
    marginBottom: spacing.xs,
    fontWeight: "700",
  },
  heroSubtitle: {
    ...textStyles.body,
    color: withOpacity(colors.neutral[0], "90"),
    fontSize: 16,
  },
  profileButton: {
    padding: spacing.xs,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: withOpacity(colors.neutral[0], "20"),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: withOpacity(colors.neutral[0], "30"),
  },
  profileInitial: {
    ...textStyles.h3,
    color: colors.neutral[0],
    fontWeight: "700",
  },
  // Add Property Button Styles
  addPropertyButton: {
    marginTop: spacing.lg,
    borderRadius: borderRadius["2xl"],
    ...shadows.xl,
  },
  addPropertyGradient: {
    padding: spacing.xl,
    borderRadius: borderRadius["2xl"],
  },
  addPropertyContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addPropertyIconContainer: {
    position: "relative",
    marginRight: spacing.lg,
  },
  addPropertyTextContainer: {
    flex: 1,
  },
  addPropertyTitle: {
    ...textStyles.h2,
    color: colors.neutral[900],
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  addPropertySubtitle: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontSize: 14,
  },
  addPropertyArrow: {
    marginLeft: spacing.md,
  },
  addPropertyArrowIcon: {
    fontSize: 24,
    color: colors.neutral[900],
    fontWeight: "700",
  },
  // Status Summary Styles
  statusSummaryCard: {
    margin: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  statusSummaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusItem: {
    alignItems: "center",
    flex: 1,
  },
  statusValue: {
    ...textStyles.h3,
    fontWeight: "700",
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  statusLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 11,
  },
  statusDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.sm,
  },
  // Enhanced Quick Actions Styles
  quickActionsContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  quickActionCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  quickActionGradient: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  quickActionContent: {
    alignItems: "center",
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: withOpacity(colors.neutral[0], "20"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionTitle: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "600",
    textAlign: "center",
  },
  quickActionBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.error[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionBadgeText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontSize: 10,
    fontWeight: "700",
  },
  // Enhanced Stats Container Styles
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  statGradient: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: withOpacity(colors.neutral[0], "20"),
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  statIcon: {
    fontSize: 24,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    ...textStyles.h2,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  // Analytics Section Styles
  analyticsSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  analyticsGrid: {
    gap: spacing.md,
  },
  // Properties Section Styles
  propertiesSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
  },
  propertiesList: {
    paddingTop: spacing.sm,
  },
  // Modal Styles (Chat Design)
  modalBackdrop: {
    flex: 1,
    backgroundColor: withOpacity(colors.neutral[900], "50"),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  popupContainer: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    width: "100%",
    maxWidth: 400,
    ...shadows.xl,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  popupTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    ...textStyles.body,
    color: colors.neutral[600],
    fontWeight: "600",
  },
  popupContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  summaryBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
    marginTop: 6,
    marginRight: spacing.sm,
  },
  summaryText: {
    ...textStyles.body,
    color: colors.neutral[700],
    flex: 1,
    lineHeight: 20,
  },
  popupFooter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.warning[50],
  },
  statusText: {
    ...textStyles.caption,
    color: colors.warning[700],
    textAlign: "center",
  },
  // Analytics Card Styles
  analyticsCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  analyticsGradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.md,
  },
  analyticsContent: {
    alignItems: "center",
  },
  analyticsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.sm,
  },
  analyticsIcon: {
    fontSize: 24,
  },
  trendIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  trendText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
    fontSize: 10,
  },
  analyticsValue: {
    ...textStyles.h1,
    color: colors.neutral[900],
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  analyticsTitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
    textAlign: "center",
  },
  analyticsExpand: {
    marginTop: spacing.sm,
  },
  expandIcon: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontWeight: "600",
    fontSize: 10,
  },
  // Chat-style Button Styles
  propertyCardContainer: {
    marginBottom: spacing.md,
  },
  statusButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 32,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  availableButton: {
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[500],
  },
  availableButtonText: {
    ...textStyles.caption,
    color: colors.success[700],
    fontWeight: "600",
    fontSize: 12,
  },
  bookedButton: {
    backgroundColor: colors.warning[50],
    borderWidth: 1,
    borderColor: colors.warning[500],
  },
  bookedButtonText: {
    ...textStyles.caption,
    color: colors.warning[700],
    fontWeight: "600",
    fontSize: 12,
  },
  draftButton: {
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[400],
  },
  draftButtonText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "600",
    fontSize: 12,
  },
  expandedContent: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  expandedRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  expandedStatusContent: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
});
