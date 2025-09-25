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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../shared/hooks/state/authStore";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  withOpacity,
} from "../../shared/constants/tokens";
import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";
import PropertyCard from "./components/PropertyCard";
import EmptyState from "../../shared/components/ui/EmptyState";
import Tag from "../../shared/components/ui/Tag";
import LogoIcon from "../../shared/components/ui/LogoIcon";

const { width } = Dimensions.get("window");

export default function OwnerHomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showAnalyticsDetails, setShowAnalyticsDetails] = useState(false);
  const [selectedAnalytic, setSelectedAnalytic] = useState<any>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showStatusSummary, setShowStatusSummary] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

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

  // Comprehensive status data
  const statusSummary = {
    activeProperties: 4,
    pendingRequests: 3,
    bookingsThisMonth: 12,
    totalEarnings: 2400,
    availableProperties: 2,
    bookedProperties: 1,
    draftProperties: 1,
    totalViews: 217,
    totalInterests: 38,
    aiInsights: {
      recommendation: "Consider lowering prices by 5% to increase bookings",
      trend: "Weekend bookings are up 23% this month",
      opportunity: "Your Tel Aviv property has 89% view-to-booking rate",
    },
  };

  // Smart analytics data
  const analyticsData = [
    {
      id: "1",
      title: "Revenue Growth",
      value: "+23%",
      change: "+12%",
      trend: "up",
      icon: "📈",
      color: colors.success[500],
    },
    {
      id: "2",
      title: "Occupancy Rate",
      value: "85%",
      change: "+5%",
      trend: "up",
      icon: "🏠",
      color: colors.primary[500],
    },
    {
      id: "3",
      title: "Guest Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: "⭐",
      color: colors.warning[500],
    },
    {
      id: "4",
      title: "Response Time",
      value: "2.3h",
      change: "-0.5h",
      trend: "down",
      icon: "⚡",
      color: colors.secondary[500],
    },
  ];

  // Recent activity with smart insights
  const recentActivity = [
    {
      id: "1",
      type: "booking",
      title: "New Booking",
      subtitle: "Tel Aviv Apartment • Dec 20-25",
      time: "2 hours ago",
      amount: "$450",
      icon: "🎉",
      priority: "high",
    },
    {
      id: "2",
      type: "message",
      title: "Guest Message",
      subtitle: "Sarah M. • Check-in question",
      time: "4 hours ago",
      amount: null,
      icon: "💬",
      priority: "medium",
    },
    {
      id: "3",
      type: "review",
      title: "New Review",
      subtitle: "5 stars • Haifa Studio",
      time: "1 day ago",
      amount: null,
      icon: "⭐",
      priority: "low",
    },
    {
      id: "4",
      type: "payment",
      title: "Payment Received",
      subtitle: "Jerusalem Penthouse • $300",
      time: "2 days ago",
      amount: "$300",
      icon: "💰",
      priority: "high",
    },
  ];

  const stats = [
    {
      label: "Active Properties",
      value: statusSummary.activeProperties.toString(),
      color: colors.primary[500],
      icon: "🏠",
    },
    {
      label: "Pending Requests",
      value: statusSummary.pendingRequests.toString(),
      color: colors.warning[500],
      icon: "⏳",
    },
    {
      label: "Bookings This Month",
      value: statusSummary.bookingsThisMonth.toString(),
      color: colors.success[500],
      icon: "✅",
    },
    {
      label: "Earnings",
      value: `$${statusSummary.totalEarnings.toLocaleString()}`,
      color: colors.secondary[500],
      icon: "💰",
    },
  ];

  const properties = [
    {
      id: "1",
      title: "2BR Apartment, Tel Aviv",
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

  const handleAddProperty = () => {
    navigation.navigate("AddApartment");
  };

  const handlePropertyDetailsPress = (property: any) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleAnalyticsPress = (analytic: any) => {
    setSelectedAnalytic(analytic);
    setShowAnalyticsDetails(true);
  };

  const closePropertyDetails = () => {
    setShowPropertyDetails(false);
    setSelectedProperty(null);
  };

  const closeAnalyticsDetails = () => {
    setShowAnalyticsDetails(false);
    setSelectedAnalytic(null);
  };

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const getButtonState = (item: any) => {
    if (item.status === "available") return "available";
    if (item.status === "booked") return "booked";
    if (item.status === "draft") return "draft";
    return "available";
  };

  const getButtonStyle = (state: string) => {
    switch (state) {
      case "available":
        return styles.availableButton;
      case "booked":
        return styles.bookedButton;
      case "draft":
        return styles.draftButton;
      default:
        return styles.availableButton;
    }
  };

  const getButtonTextStyle = (state: string) => {
    switch (state) {
      case "available":
        return styles.availableButtonText;
      case "booked":
        return styles.bookedButtonText;
      case "draft":
        return styles.draftButtonText;
      default:
        return styles.availableButtonText;
    }
  };

  const getButtonText = (state: string) => {
    switch (state) {
      case "available":
        return "Available";
      case "booked":
        return "Booked";
      case "draft":
        return "Draft";
      default:
        return "Available";
    }
  };

  // Quick actions for common tasks
  const quickActions = [
    {
      id: "add-property",
      title: "Add Property",
      icon: "➕",
      color: colors.primary[500],
      onPress: handleAddProperty,
    },
    {
      id: "view-requests",
      title: "View Requests",
      icon: "📋",
      color: colors.warning[500],
      onPress: () => navigation.navigate("RenterRequests"),
      badge:
        statusSummary.pendingRequests > 0
          ? statusSummary.pendingRequests
          : null,
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: "📊",
      color: colors.secondary[500],
      onPress: () => console.log("Analytics"),
    },
    {
      id: "messages",
      title: "Messages",
      icon: "💬",
      color: colors.success[500],
      onPress: () => navigation.navigate("Chat"),
    },
  ];

  const handlePropertyPress = (propertyId: string) => {
    // Navigate to property details
    console.log("Property pressed:", propertyId);
  };

  const handleEditProperty = (propertyId: string) => {
    // Navigate to edit property
    console.log("Edit property:", propertyId);
  };

  const handleViewRenters = (propertyId: string) => {
    // Navigate to interested renters for this property
    navigation.navigate("InterestedRenters", { propertyId });
  };

  const handleDeleteProperty = (propertyId: string) => {
    // Show delete confirmation
    console.log("Delete property:", propertyId);
  };

  const renderProperty = ({ item }: { item: (typeof properties)[0] }) => {
    const buttonState = getButtonState(item);
    const isExpanded = expandedCards.has(item.id);

    return (
      <View style={styles.propertyCardContainer}>
        <TouchableOpacity
          onPress={() => handlePropertyDetailsPress(item)}
          activeOpacity={0.8}
        >
          <PropertyCard
            {...item}
            onPress={() => handlePropertyPress(item.id)}
            onViewRentersPress={() => handleViewRenters(item.id)}
          />
        </TouchableOpacity>

        {/* Chat-style Status Button */}
        <TouchableOpacity
          style={[getButtonStyle(buttonState), styles.statusButton]}
          onPress={() => toggleCardExpansion(item.id)}
          activeOpacity={0.8}
        >
          <Text style={getButtonTextStyle(buttonState)}>
            {getButtonText(buttonState)}
          </Text>
          <Text style={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <Animated.View style={styles.expandedContent}>
            <View style={styles.expandedRow}>
              <View style={styles.summaryBullet} />
              <Text style={styles.summaryText}>
                Views: {item.views} • Interests: {item.interests}
              </Text>
            </View>
            <View style={styles.expandedRow}>
              <View style={styles.summaryBullet} />
              <Text style={styles.summaryText}>
                Next Booking: {item.nextBooking}
              </Text>
            </View>
            {(item as any).performance && (
              <>
                <View style={styles.expandedRow}>
                  <View style={styles.summaryBullet} />
                  <Text style={styles.summaryText}>
                    Occupancy: {(item as any).performance.occupancy}%
                  </Text>
                </View>
                <View style={styles.expandedRow}>
                  <View style={styles.summaryBullet} />
                  <Text style={styles.summaryText}>
                    Revenue: ${(item as any).performance.revenue}
                  </Text>
                </View>
              </>
            )}
          </Animated.View>
        )}
      </View>
    );
  };

  const renderAnalyticsCard = ({
    item,
  }: {
    item: (typeof analyticsData)[0];
  }) => (
    <TouchableOpacity
      onPress={() => handleAnalyticsPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.analyticsCard}>
        <LinearGradient
          colors={[item.color + "15", item.color + "05"]}
          style={styles.analyticsGradient}
        >
          <View style={styles.analyticsContent}>
            <View style={styles.analyticsHeader}>
              <Text style={styles.analyticsIcon}>{item.icon}</Text>
              <View
                style={[
                  styles.trendIndicator,
                  {
                    backgroundColor:
                      item.trend === "up"
                        ? colors.success[500]
                        : colors.error[500],
                  },
                ]}
              >
                <Text style={styles.trendText}>{item.change}</Text>
              </View>
            </View>
            <Text style={styles.analyticsValue}>{item.value}</Text>
            <Text style={styles.analyticsTitle}>{item.title}</Text>
            <View style={styles.analyticsExpand}>
              <Text style={styles.expandIcon}>▼</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

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

        {/* Status Summary - Chat Style */}
        <TouchableOpacity
          style={styles.statusSummaryCard}
          onPress={() => setShowStatusSummary(!showStatusSummary)}
          activeOpacity={0.8}
        >
          <View style={styles.statusSummaryContent}>
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>
                {statusSummary.activeProperties}
              </Text>
              <Text style={styles.statusLabel}>Properties</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text
                style={[styles.statusValue, { color: colors.warning[500] }]}
              >
                {statusSummary.pendingRequests}
              </Text>
              <Text style={styles.statusLabel}>Pending</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text
                style={[styles.statusValue, { color: colors.success[500] }]}
              >
                {statusSummary.bookingsThisMonth}
              </Text>
              <Text style={styles.statusLabel}>Bookings</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text
                style={[styles.statusValue, { color: colors.secondary[500] }]}
              >
                ${statusSummary.totalEarnings.toLocaleString()}
              </Text>
              <Text style={styles.statusLabel}>Earnings</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text
                style={[styles.statusValue, { color: colors.primary[500] }]}
              >
                {statusSummary.totalViews}
              </Text>
              <Text style={styles.statusLabel}>Views</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text
                style={[styles.statusValue, { color: colors.warning[600] }]}
              >
                {statusSummary.totalInterests}
              </Text>
              <Text style={styles.statusLabel}>Interests</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.expandIcon}>
                {showStatusSummary ? "▲" : "▼"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Expanded Status Summary */}
        {showStatusSummary && (
          <Animated.View style={styles.expandedStatusContent}>
            <View style={styles.expandedRow}>
              <View style={styles.summaryBullet} />
              <Text style={styles.summaryText}>
                Available Properties: {statusSummary.availableProperties}
              </Text>
            </View>
            <View style={styles.expandedRow}>
              <View style={styles.summaryBullet} />
              <Text style={styles.summaryText}>
                Booked Properties: {statusSummary.bookedProperties}
              </Text>
            </View>
            <View style={styles.expandedRow}>
              <View style={styles.summaryBullet} />
              <Text style={styles.summaryText}>
                Draft Properties: {statusSummary.draftProperties}
              </Text>
            </View>
            <View style={styles.expandedRow}>
              <View style={styles.summaryBullet} />
              <Text style={styles.summaryText}>
                Total Views: {statusSummary.totalViews}
              </Text>
            </View>
            <View style={styles.expandedRow}>
              <View style={styles.summaryBullet} />
              <Text style={styles.summaryText}>
                Total Interests: {statusSummary.totalInterests}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Enhanced Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[action.color + "20", action.color + "10"]}
                  style={styles.quickActionGradient}
                >
                  <View style={styles.quickActionContent}>
                    <View style={styles.quickActionIconContainer}>
                      <Text style={styles.quickActionIcon}>{action.icon}</Text>
                    </View>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    {action.badge && (
                      <View style={styles.quickActionBadge}>
                        <Text style={styles.quickActionBadgeText}>
                          {action.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.statCard}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[stat.color + "15", stat.color + "05"]}
                style={styles.statGradient}
              >
                <View style={styles.statContent}>
                  <View style={styles.statIconContainer}>
                    <Text style={styles.statIcon}>{stat.icon}</Text>
                  </View>
                  <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: stat.color }]}>
                      {stat.value}
                    </Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* My Properties Section */}
        {/* Smart Analytics Section */}
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>Smart Analytics</Text>
          <FlatList
            data={analyticsData}
            renderItem={renderAnalyticsCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.analyticsGrid}
          />
        </View>

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
            />
          ) : (
            <EmptyState
              icon="🏠"
              title="No properties yet"
              subtitle="Add your first property to start renting"
              actionLabel="Add Property"
              onActionPress={handleAddProperty}
            />
          )}
        </View>
      </ScrollView>

      {/* Property Details Modal */}
      <Modal
        visible={showPropertyDetails}
        transparent={true}
        animationType="fade"
        onRequestClose={closePropertyDetails}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={closePropertyDetails}
        >
          <View style={styles.popupContainer}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.popupHeader}>
                <Text style={styles.popupTitle}>Property Details</Text>
                <TouchableOpacity
                  onPress={closePropertyDetails}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.popupContent}>
                {selectedProperty && (
                  <>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Title: {selectedProperty.title}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Location: {selectedProperty.location}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Status: {selectedProperty.status}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Views: {selectedProperty.views}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Interests: {selectedProperty.interests}
                      </Text>
                    </View>
                    {selectedProperty.performance && (
                      <>
                        <View style={styles.summaryRow}>
                          <View style={styles.summaryBullet} />
                          <Text style={styles.summaryText}>
                            Occupancy: {selectedProperty.performance.occupancy}%
                          </Text>
                        </View>
                        <View style={styles.summaryRow}>
                          <View style={styles.summaryBullet} />
                          <Text style={styles.summaryText}>
                            Revenue: ${selectedProperty.performance.revenue}
                          </Text>
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>

              <View style={styles.popupFooter}>
                <Text style={styles.statusText}>
                  Status:{" "}
                  <Text style={styles.statusValue}>
                    {selectedProperty?.status || "Unknown"}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Analytics Details Modal */}
      <Modal
        visible={showAnalyticsDetails}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAnalyticsDetails}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={closeAnalyticsDetails}
        >
          <View style={styles.popupContainer}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.popupHeader}>
                <Text style={styles.popupTitle}>Analytics Details</Text>
                <TouchableOpacity
                  onPress={closeAnalyticsDetails}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.popupContent}>
                {selectedAnalytic && (
                  <>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Metric: {selectedAnalytic.title}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Current Value: {selectedAnalytic.value}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Change: {selectedAnalytic.change}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryBullet} />
                      <Text style={styles.summaryText}>
                        Trend:{" "}
                        {selectedAnalytic.trend === "up"
                          ? "📈 Upward"
                          : "📉 Downward"}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.popupFooter}>
                <Text style={styles.statusText}>
                  Trend:{" "}
                  <Text style={styles.statusValue}>
                    {selectedAnalytic?.trend === "up" ? "Positive" : "Negative"}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
