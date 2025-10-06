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
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../core/services/authenticationStore";
import { useOwnerPropertyList } from "../../../core/services/ownerPropertyListManager";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
  liquidGlass,
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
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const glassAnim = useRef(new Animated.Value(0)).current;
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "actions" | "activity" | "properties"
  >("actions");

  // Dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 0,
    totalEarnings: 0,
    activeBookings: 0,
    totalViews: 0,
    totalInterests: 0,
  });

  // Recent activity data
  const [recentActivity, setRecentActivity] = useState([
    {
      id: "1",
      type: "booking",
      title: "New booking request",
      description: "Sarah M. wants to book your apartment for 3 months",
      time: "2 hours ago",
      icon: "calendar",
      color: colors.success[500],
    },
    {
      id: "2",
      type: "message",
      title: "New message",
      description: "John D. sent you a message about your property",
      time: "4 hours ago",
      icon: "chatbubble",
      color: colors.primary[500],
    },
    {
      id: "3",
      type: "view",
      title: "Property viewed",
      description: "Your apartment in Tel Aviv was viewed 12 times today",
      time: "1 day ago",
      icon: "eye",
      color: colors.secondary[500],
    },
  ]);

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(glassAnim, {
        toValue: 1,
        duration: 1000,
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

      // Calculate dashboard statistics
      const stats = {
        totalProperties: publishedProperties.length,
        totalEarnings: publishedProperties.reduce((sum, prop) => {
          // Mock earnings calculation - in real app this would come from booking data
          return sum + (prop.price || 0) * (prop.bookings || 0);
        }, 0),
        activeBookings: publishedProperties.reduce((sum, prop) => {
          return sum + ((prop as any).activeBookings || 0);
        }, 0),
        totalViews: publishedProperties.reduce((sum, prop) => {
          return sum + ((prop as any).views || 0);
        }, 0),
        totalInterests: publishedProperties.reduce((sum, prop) => {
          return sum + ((prop as any).interests || 0);
        }, 0),
      };
      setDashboardStats(stats);
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

  // Quick action handlers
  const handleViewAnalytics = () => {
    // Navigate to analytics screen
    navigation.navigate("Analytics");
  };

  const handleManageBookings = () => {
    // Navigate to bookings management
    navigation.navigate("Bookings");
  };

  const handleViewMessages = () => {
    // Navigate to messages/chat
    navigation.navigate("Chat");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
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

  const renderActivityItem = ({
    item,
  }: {
    item: (typeof recentActivity)[0];
  }) => {
    return (
      <TouchableOpacity
        style={styles.activityItemGlass}
        activeOpacity={0.7}
        onPress={() => {
          // Handle activity item press based on type
          if (item.type === "booking") {
            navigation.navigate("Offers");
          } else if (item.type === "message") {
            navigation.navigate("Chat");
          }
        }}
      >
        <View
          style={[
            styles.activityIconContainerGlass,
            { backgroundColor: withOpacity(item.color, "20") },
          ]}
        >
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityDescription}>{item.description}</Text>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.neutral[400]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* iOS 26 Liquid Glass Hero Section */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: glassAnim,
                transform: [{ scale: glassAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                withOpacity(colors.primary[500], "90"),
                withOpacity(colors.primary[600], "80"),
                withOpacity(colors.primary[700], "80"),
              ]}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                <View style={styles.heroHeader}>
                  <View style={styles.heroTextContainer}>
                    <Text style={styles.heroGreeting}>
                      Good{" "}
                      {new Date().getHours() < 12
                        ? "morning"
                        : new Date().getHours() < 18
                        ? "afternoon"
                        : "evening"}
                      , {user?.name?.split(" ")[0]}!
                    </Text>
                    <Text style={styles.heroSubtitle}>
                      Manage your rental empire
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate("Profile")}
                    activeOpacity={0.8}
                  >
                    <View style={styles.profileImageGlass}>
                      <LogoIcon size={80} color={colors.neutral[0]} />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Liquid Glass Dashboard Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statsRow}>
                    <View style={styles.statCardGlass}>
                      <View style={styles.statIconContainerGlass}>
                        <Ionicons
                          name="home"
                          size={20}
                          color={colors.neutral[0]}
                        />
                      </View>
                      <Text style={styles.statValue}>
                        {dashboardStats.totalProperties}
                      </Text>
                      <Text style={styles.statLabel}>Properties</Text>
                    </View>
                    <View style={styles.statCardGlass}>
                      <View style={styles.statIconContainerGlass}>
                        <Ionicons
                          name="cash"
                          size={20}
                          color={colors.neutral[0]}
                        />
                      </View>
                      <Text style={styles.statValue}>
                        {formatCurrency(dashboardStats.totalEarnings)}
                      </Text>
                      <Text style={styles.statLabel}>Earnings</Text>
                    </View>
                  </View>
                  <View style={styles.statsRow}>
                    <View style={styles.statCardGlass}>
                      <View style={styles.statIconContainerGlass}>
                        <Ionicons
                          name="calendar"
                          size={20}
                          color={colors.neutral[0]}
                        />
                      </View>
                      <Text style={styles.statValue}>
                        {dashboardStats.activeBookings}
                      </Text>
                      <Text style={styles.statLabel}>Bookings</Text>
                    </View>
                    <View style={styles.statCardGlass}>
                      <View style={styles.statIconContainerGlass}>
                        <Ionicons
                          name="eye"
                          size={20}
                          color={colors.neutral[0]}
                        />
                      </View>
                      <Text style={styles.statValue}>
                        {dashboardStats.totalViews}
                      </Text>
                      <Text style={styles.statLabel}>Views</Text>
                    </View>
                  </View>
                </View>

                {/* Liquid Glass Add Property Button */}
                <TouchableOpacity
                  style={styles.addPropertyButtonGlass}
                  onPress={handleAddProperty}
                  activeOpacity={0.8}
                >
                  <View style={styles.addPropertyGlassContent}>
                    <View style={styles.addPropertyIconContainerGlass}>
                      <Ionicons
                        name="add-circle"
                        size={32}
                        color={colors.neutral[0]}
                      />
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
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={colors.neutral[0]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Tabbed Content Section */}
          <View style={styles.tabbedSection}>
            {/* Tab Selector */}
            <View style={styles.tabSelectorContainer}>
              {/* Active Status Indicator */}
              <Animated.View
                style={[
                  styles.activeIndicator,
                  {
                    left:
                      selectedTab === "actions"
                        ? "0%"
                        : selectedTab === "activity"
                        ? "33.33%"
                        : "66.66%",
                  },
                ]}
              />

              <View style={styles.tabSelector}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === "actions" && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab("actions")}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.tabIconContainer,
                      selectedTab === "actions" &&
                        styles.tabIconContainerActive,
                    ]}
                  >
                    <Ionicons
                      name="flash"
                      size={20}
                      color={
                        selectedTab === "actions"
                          ? colors.primary[600]
                          : colors.neutral[500]
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.tabButtonText,
                      selectedTab === "actions" && styles.tabButtonTextActive,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Actions
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === "activity" && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab("activity")}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.tabIconContainer,
                      selectedTab === "activity" &&
                        styles.tabIconContainerActive,
                    ]}
                  >
                    <Ionicons
                      name="time"
                      size={20}
                      color={
                        selectedTab === "activity"
                          ? colors.primary[600]
                          : colors.neutral[500]
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.tabButtonText,
                      selectedTab === "activity" && styles.tabButtonTextActive,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Activity
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === "properties" && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab("properties")}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.tabIconContainer,
                      selectedTab === "properties" &&
                        styles.tabIconContainerActive,
                    ]}
                  >
                    <Ionicons
                      name="home"
                      size={20}
                      color={
                        selectedTab === "properties"
                          ? colors.primary[600]
                          : colors.neutral[500]
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.tabButtonText,
                      selectedTab === "properties" &&
                        styles.tabButtonTextActive,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Properties
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tab Content */}
            <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
              {selectedTab === "actions" && (
                <View style={styles.quickActionsSection}>
                  <View style={styles.quickActionsGrid}>
                    <TouchableOpacity
                      style={styles.quickActionCardGlass}
                      onPress={handleViewAnalytics}
                      activeOpacity={0.7}
                    >
                      <View style={styles.quickActionGlassContent}>
                        <View style={styles.quickActionIconContainerGlass}>
                          <Ionicons
                            name="analytics"
                            size={24}
                            color={colors.primary[600]}
                          />
                        </View>
                        <Text style={styles.quickActionTitle}>Analytics</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.quickActionCardGlass}
                      onPress={handleManageBookings}
                      activeOpacity={0.7}
                    >
                      <View style={styles.quickActionGlassContent}>
                        <View style={styles.quickActionIconContainerGlass}>
                          <Ionicons
                            name="calendar"
                            size={24}
                            color={colors.warning[600]}
                          />
                        </View>
                        <Text style={styles.quickActionTitle}>Bookings</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.quickActionCardGlass}
                      onPress={handleViewMessages}
                      activeOpacity={0.7}
                    >
                      <View style={styles.quickActionGlassContent}>
                        <View style={styles.quickActionIconContainerGlass}>
                          <Ionicons
                            name="chatbubbles"
                            size={24}
                            color={colors.secondary[600]}
                          />
                        </View>
                        <Text style={styles.quickActionTitle}>Messages</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.quickActionCardGlass}
                      onPress={() => navigation.navigate("Profile")}
                      activeOpacity={0.7}
                    >
                      <View style={styles.quickActionGlassContent}>
                        <View style={styles.quickActionIconContainerGlass}>
                          <Ionicons
                            name="settings"
                            size={24}
                            color={colors.neutral[600]}
                          />
                        </View>
                        <Text style={styles.quickActionTitle}>Settings</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {selectedTab === "activity" && (
                <View style={styles.recentActivitySection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <Button
                      title="View All"
                      onPress={() => navigation.navigate("Activity")}
                      variant="tertiary"
                      size="sm"
                    />
                  </View>
                  <FlatList
                    data={recentActivity}
                    renderItem={renderActivityItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    contentContainerStyle={styles.activityList}
                  />
                </View>
              )}

              {selectedTab === "properties" && (
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
                      title="Ready to Start Earning?"
                      subtitle="Transform your space into a profitable rental property. Add your first property and start connecting with renters today!"
                      actionLabel="Add Your First Property"
                      onActionPress={handleAddProperty}
                      icon="🏡"
                    />
                  )}
                </View>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  animatedContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 120, // Extra padding for floating nav bar (80px height + 16px margin + 24px extra)
  },
  // iOS 26 Liquid Glass Hero Section Styles
  heroSection: {
    paddingTop: spacing.lg,
    paddingBottom: spacing["2xl"],
    paddingHorizontal: spacing.lg,
    position: "relative",
  },
  heroGradient: {
    borderRadius: liquidGlass.radius.xl,
    padding: spacing.lg,
    ...shadows.xl,
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
  heroTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  heroGreeting: {
    ...textStyles.h1,
    color: colors.neutral[0],
    fontWeight: "700",
    textShadowColor: withOpacity(colors.neutral[900], "20"),
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    ...textStyles.body,
    color: withOpacity(colors.neutral[0], "90"),
    fontSize: 16,
    textShadowColor: withOpacity(colors.neutral[900], "20"),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileButton: {
    padding: spacing.xs,
  },
  profileImageGlass: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: liquidGlass.glass.medium.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: liquidGlass.glass.medium.border,
    ...shadows.md,
  },
  // Liquid Glass Add Property Button Styles
  addPropertyButtonGlass: {
    marginTop: spacing.lg,
    borderRadius: liquidGlass.radius["2xl"],
    backgroundColor: liquidGlass.glass.medium.background,
    borderWidth: 1,
    borderColor: liquidGlass.glass.medium.border,
    ...shadows.xl,
    shadowColor: liquidGlass.glass.medium.shadow,
  },
  addPropertyGlassContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xl,
  },
  addPropertyIconContainerGlass: {
    position: "relative",
    marginRight: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: liquidGlass.glass.strong.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: liquidGlass.glass.strong.border,
  },
  addPropertyTextContainer: {
    flex: 1,
  },
  addPropertyTitle: {
    ...textStyles.h2,
    color: colors.neutral[0],
    fontWeight: "700",
    marginBottom: spacing.xs,
    textShadowColor: withOpacity(colors.neutral[900], "20"),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  addPropertySubtitle: {
    ...textStyles.body,
    color: withOpacity(colors.neutral[0], "80"),
    fontSize: 14,
  },
  addPropertyArrow: {
    marginLeft: spacing.md,
  },
  addPropertyArrowIcon: {
    fontSize: 24,
    color: colors.neutral[0],
    fontWeight: "700",
  },
  // Liquid Glass Dashboard Stats Styles
  statsContainer: {
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  statCardGlass: {
    flex: 1,
    backgroundColor: liquidGlass.glass.light.background,
    borderRadius: liquidGlass.radius.lg,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
    ...shadows.md,
    shadowColor: liquidGlass.glass.light.shadow,
  },
  statIconContainerGlass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: liquidGlass.glass.medium.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: liquidGlass.glass.medium.border,
  },
  statValue: {
    ...textStyles.h4,
    color: colors.neutral[0],
    fontWeight: "700",
    marginBottom: spacing.xs,
    textShadowColor: withOpacity(colors.neutral[900], "20"),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    ...textStyles.caption,
    color: withOpacity(colors.neutral[0], "80"),
    fontSize: 11,
    textAlign: "center",
  },
  // Tabbed Section Styles
  tabbedSection: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  tabSelectorContainer: {
    position: "relative",
    marginBottom: spacing.lg,
  },
  activeIndicator: {
    position: "absolute",
    top: -8,
    width: "33.33%",
    height: 4,
    backgroundColor: liquidGlass.glass.strong.background,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: liquidGlass.glass.strong.border,
    ...shadows.sm,
    shadowColor: liquidGlass.glass.strong.shadow,
    zIndex: 1,
  },
  tabSelector: {
    flexDirection: "row",
    backgroundColor: liquidGlass.glass.light.background,
    borderRadius: liquidGlass.radius.xl,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
    ...shadows.md,
    shadowColor: liquidGlass.glass.light.shadow,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: liquidGlass.radius.lg,
    gap: spacing.sm,
    minHeight: 56,
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
  },
  tabButtonActive: {
    backgroundColor: liquidGlass.glass.strong.background,
    borderWidth: 1,
    borderColor: liquidGlass.glass.strong.border,
    ...shadows.lg,
    shadowColor: liquidGlass.glass.strong.shadow,
    transform: [{ scale: 1.02 }],
  },
  tabButtonText: {
    ...textStyles.body,
    color: colors.neutral[500],
    fontWeight: "500",
    fontSize: 12,
  },
  tabButtonTextActive: {
    color: colors.primary[600],
    fontWeight: "700",
    fontSize: 13,
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: liquidGlass.glass.light.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
  },
  tabIconContainerActive: {
    backgroundColor: liquidGlass.glass.medium.background,
    borderColor: liquidGlass.glass.medium.border,
    ...shadows.sm,
    shadowColor: liquidGlass.glass.medium.shadow,
  },
  tabContent: {
    minHeight: 200,
  },
  // Liquid Glass Quick Actions Section Styles
  quickActionsSection: {
    paddingTop: 0,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  quickActionCardGlass: {
    flex: 1,
    minWidth: "45%",
    borderRadius: liquidGlass.radius.xl,
    backgroundColor: liquidGlass.glass.light.background,
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
    ...shadows.md,
    shadowColor: liquidGlass.glass.light.shadow,
  },
  quickActionGlassContent: {
    padding: spacing.lg,
    borderRadius: liquidGlass.radius.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  quickActionIconContainerGlass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: liquidGlass.glass.medium.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: liquidGlass.glass.medium.border,
  },
  quickActionTitle: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.xs,
  },
  // Liquid Glass Recent Activity Section Styles
  recentActivitySection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  activityList: {
    paddingTop: spacing.sm,
  },
  activityItemGlass: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: liquidGlass.glass.light.background,
    borderRadius: liquidGlass.radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: liquidGlass.glass.light.border,
    ...shadows.sm,
    shadowColor: liquidGlass.glass.light.shadow,
  },
  activityIconContainerGlass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: liquidGlass.glass.medium.border,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...textStyles.caption,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  activityDescription: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  activityTime: {
    ...textStyles.caption,
    color: colors.neutral[500],
    fontSize: 11,
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
