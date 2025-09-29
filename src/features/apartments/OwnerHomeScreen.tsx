import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../shared/constants/tokens";
import { useOwnerPropertyList } from "../../core/services/ownerPropertyListManager";
import { OwnerProperty } from "../../core/types/ownerPropertyList";
import MyPropertyCard from "./components/MyPropertyCard";

interface OwnerHomeScreenProps {
  navigation: any;
  route?: any;
}

export default function OwnerHomeScreen({
  navigation,
  route,
}: OwnerHomeScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const ownerPropertyList = useOwnerPropertyList("current-owner");

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

  const onRefresh = async () => {
    setRefreshing(true);
    loadProperties();
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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

  const handleEditProperty = (property: OwnerProperty) => {
    navigation.navigate("AddProperty", {
      editMode: true,
      propertyId: property.id,
    });
  };

  const handleViewRenters = (propertyId: string) => {
    navigation.navigate("InterestedRenters", { propertyId });
  };

  const stats = ownerPropertyList.getPropertyStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Owner Dashboard</Text>
        <Text style={styles.subtitle}>Manage your properties</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Properties</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.published}</Text>
            <Text style={styles.statLabel}>Published</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.draft}</Text>
            <Text style={styles.statLabel}>Drafts</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("AddProperty")}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Property</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to a filtered view of all properties
              console.log("View all properties");
            }}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>All Properties</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Published Properties Section */}
        <View style={styles.publishedProperties}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Published Properties</Text>
            <TouchableOpacity
              onPress={() => {
                // Navigate to a filtered view of all properties
                console.log("View all properties");
              }}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {properties.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏠</Text>
              <Text style={styles.emptyTitle}>No Published Properties</Text>
              <Text style={styles.emptySubtitle}>
                Start by adding your first property
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate("AddProperty")}
              >
                <Text style={styles.emptyButtonText}>Add Property</Text>
              </TouchableOpacity>
            </View>
          ) : (
            properties
              .slice(0, 3)
              .reverse()
              .map((property) => {
                const propertyTitle = `${
                  property.propertyCategory === "house" ? "House" : "Apartment"
                } • ${property.area?.name || "Tel Aviv"}`;

                return (
                  <MyPropertyCard
                    key={property.id}
                    property={property}
                    onPress={() => {
                      // Navigate to property details
                      navigation.navigate("PropertyDetails", { property });
                    }}
                    onEditPress={() => handleEditProperty(property)}
                    onViewRentersPress={() => handleViewRenters(property.id)}
                    onDeletePress={() =>
                      handleDeleteProperty(property.id, propertyTitle)
                    }
                  />
                );
              })
          )}
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>🏠</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New booking received</Text>
              <Text style={styles.activitySubtitle}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>💬</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New message from tenant</Text>
              <Text style={styles.activitySubtitle}>4 hours ago</Text>
            </View>
          </View>
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
  header: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  stats: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.sm,
  },
  statNumber: {
    ...textStyles.h2,
    color: colors.primary[600],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral[200],
    ...shadows.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  actionText: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "500",
  },
  publishedProperties: {
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  viewAllText: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyButtonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "500",
  },
  propertyCard: {
    flexDirection: "row",
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  propertyImageContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    marginRight: spacing.md,
  },
  propertyImage: {
    width: "100%",
    height: "100%",
  },
  propertyImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.neutral[200],
    justifyContent: "center",
    alignItems: "center",
  },
  propertyImagePlaceholderText: {
    fontSize: 24,
  },
  propertyInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  propertyTitle: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  propertyAddress: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  propertyDetails: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  propertyDetail: {
    ...textStyles.caption,
    color: colors.neutral[700],
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  propertyPrice: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "600",
  },
  propertyActions: {
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 80,
  },
  propertyStats: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  deleteButton: {
    backgroundColor: colors.error[50],
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  deleteButtonText: {
    fontSize: 16,
  },
  statValue: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  recentActivity: {
    backgroundColor: colors.neutral[0],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.lg,
    fontWeight: "600",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  activityIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
    textAlign: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...textStyles.body,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  activitySubtitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
});
