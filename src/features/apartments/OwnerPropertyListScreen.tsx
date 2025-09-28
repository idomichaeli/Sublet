import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../shared/constants/tokens";
import { useOwnerPropertyList } from "../../core/services/ownerPropertyListManager";
import { OwnerProperty } from "../../core/types/ownerPropertyList";
import { usePropertyManager } from "../../core/services/propertyManager";

interface OwnerPropertyListScreenProps {
  ownerId: string;
  navigation: any;
}

export default function OwnerPropertyListScreen({
  ownerId,
  navigation,
}: OwnerPropertyListScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "published" | "draft" | "archived"
  >("all");

  const ownerPropertyList = useOwnerPropertyList(ownerId);
  const propertyManager = usePropertyManager(ownerId);

  // Get properties based on selected status
  const getFilteredProperties = (): OwnerProperty[] => {
    switch (selectedStatus) {
      case "published":
        return ownerPropertyList.getPublishedProperties();
      case "draft":
        return ownerPropertyList.getDraftProperties();
      case "archived":
        return ownerPropertyList.getArchivedProperties();
      default:
        return ownerPropertyList.getAllProperties();
    }
  };

  const properties = getFilteredProperties();
  const stats = ownerPropertyList.getPropertyStats();

  // Refresh data
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data from the server
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Handle property actions
  const handlePublishProperty = (propertyId: string) => {
    const result = ownerPropertyList.publishProperty(propertyId);
    if (result.success) {
      Alert.alert("Success", "Property published successfully!");
    } else {
      Alert.alert(
        "Error",
        result.errors?.join(", ") || "Failed to publish property"
      );
    }
  };

  const handleArchiveProperty = (propertyId: string) => {
    Alert.alert(
      "Archive Property",
      "Are you sure you want to archive this property? It will be hidden from renters.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          style: "destructive",
          onPress: () => {
            const result = ownerPropertyList.archiveProperty(propertyId);
            if (result.success) {
              Alert.alert("Success", "Property archived successfully!");
            } else {
              Alert.alert(
                "Error",
                result.errors?.join(", ") || "Failed to archive property"
              );
            }
          },
        },
      ]
    );
  };

  const handleUnarchiveProperty = (propertyId: string) => {
    const result = ownerPropertyList.unarchiveProperty(propertyId);
    if (result.success) {
      Alert.alert("Success", "Property unarchived successfully!");
    } else {
      Alert.alert(
        "Error",
        result.errors?.join(", ") || "Failed to unarchive property"
      );
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const result = ownerPropertyList.deleteProperty(propertyId);
            if (result.success) {
              Alert.alert("Success", "Property deleted successfully!");
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
    // Load property into property manager for editing
    propertyManager.loadProperty(property, property.id);
    navigation.navigate("AddProperty", {
      editMode: true,
      propertyId: property.id,
    });
  };

  // Handle property press to navigate to details
  const handlePropertyPress = (property: OwnerProperty) => {
    navigation.navigate("PropertyDetails", { property });
  };

  // Render property item
  const renderPropertyItem = ({ item: property }: { item: OwnerProperty }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => handlePropertyPress(property)}
      activeOpacity={0.8}
    >
      <View style={styles.propertyHeader}>
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>
            {property.street} {property.streetNumber}
          </Text>
          <Text style={styles.propertySubtitle}>
            {property.area?.name || "Tel Aviv"} • {property.propertyCategory} •{" "}
            {property.propertyType}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(property.status) },
          ]}
        >
          <Text style={styles.statusText}>{property.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.propertyDetails}>
        <Text style={styles.propertyDetail}>
          {property.bedrooms} bed • {property.bathrooms} bath • {property.size}
          m²
        </Text>
        <Text style={styles.propertyPrice}>
          ${property.price.toLocaleString()}/{property.pricingFrequency}
        </Text>
      </View>

      <View style={styles.propertyStats}>
        <Text style={styles.statText}>Views: {property.views || 0}</Text>
        <Text style={styles.statText}>
          Inquiries: {property.inquiries || 0}
        </Text>
        <Text style={styles.statText}>Bookings: {property.bookings || 0}</Text>
      </View>

      <View style={styles.propertyActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditProperty(property)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        {property.status === "draft" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.publishButton]}
            onPress={() => handlePublishProperty(property.id)}
          >
            <Text style={[styles.actionButtonText, styles.publishButtonText]}>
              Publish
            </Text>
          </TouchableOpacity>
        )}

        {property.status === "published" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.archiveButton]}
            onPress={() => handleArchiveProperty(property.id)}
          >
            <Text style={[styles.actionButtonText, styles.archiveButtonText]}>
              Archive
            </Text>
          </TouchableOpacity>
        )}

        {property.status === "archived" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.unarchiveButton]}
            onPress={() => handleUnarchiveProperty(property.id)}
          >
            <Text style={[styles.actionButtonText, styles.unarchiveButtonText]}>
              Unarchive
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProperty(property.id)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Get status color
  const getStatusColor = (status: OwnerProperty["status"]): string => {
    switch (status) {
      case "published":
        return colors.success[500];
      case "draft":
        return colors.warning[500];
      case "archived":
        return colors.neutral[500];
      case "sold":
        return colors.secondary[500];
      case "rented":
        return colors.primary[500];
      default:
        return colors.neutral[500];
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Properties</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            propertyManager.initializeNewProperty();
            navigation.navigate("AddProperty");
          }}
        >
          <Text style={styles.addButtonText}>+ Add Property</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.published}</Text>
          <Text style={styles.statLabel}>Published</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.draft}</Text>
          <Text style={styles.statLabel}>Drafts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.archived}</Text>
          <Text style={styles.statLabel}>Archived</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(["all", "published", "draft", "archived"] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterTab,
              selectedStatus === status && styles.filterTabActive,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedStatus === status && styles.filterTabTextActive,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Properties List */}
      <FlatList
        data={properties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No properties found</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                propertyManager.initializeNewProperty();
                navigation.navigate("AddProperty");
              }}
            >
              <Text style={styles.emptyButtonText}>
                Add Your First Property
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.neutral[900],
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.neutral[0],
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "700",
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
  },
  filterTabActive: {
    backgroundColor: colors.primary[500],
  },
  filterTabText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: colors.neutral[0],
  },
  listContainer: {
    padding: spacing.lg,
  },
  propertyCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  propertySubtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
    fontSize: 10,
  },
  propertyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  propertyDetail: {
    ...textStyles.body,
    color: colors.neutral[700],
  },
  propertyPrice: {
    ...textStyles.h3,
    color: colors.primary[500],
    fontWeight: "600",
  },
  propertyStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
  },
  statText: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  propertyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral[0],
    marginHorizontal: spacing.xs,
    alignItems: "center",
  },
  actionButtonText: {
    ...textStyles.caption,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  publishButton: {
    borderColor: colors.success[500],
    backgroundColor: colors.success[50],
  },
  publishButtonText: {
    color: colors.success[700],
  },
  archiveButton: {
    borderColor: colors.warning[500],
    backgroundColor: colors.warning[50],
  },
  archiveButtonText: {
    color: colors.warning[700],
  },
  unarchiveButton: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  unarchiveButtonText: {
    color: colors.primary[700],
  },
  deleteButton: {
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  deleteButtonText: {
    color: colors.error[700],
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...textStyles.h3,
    color: colors.neutral[600],
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyButtonText: {
    ...textStyles.body,
    color: colors.neutral[0],
    fontWeight: "600",
  },
});
