import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useAuthStore } from "../../shared/hooks/state/authStore";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../shared/constants/tokens";
import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";
import Tag from "../../shared/components/ui/Tag";
import ApartmentCard from "../../shared/components/ui/ApartmentCard";

export default function OwnerDashboardScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();

  const stats = [
    {
      label: "Active Listings",
      value: "4",
      color: colors.primary[500],
      icon: "🏠",
    },
    {
      label: "Pending Requests",
      value: "3",
      color: colors.warning[500],
      icon: "⏳",
    },
    {
      label: "Bookings This Month",
      value: "12",
      color: colors.success[500],
      icon: "✅",
    },
    {
      label: "Earnings",
      value: "$2,400",
      color: colors.secondary[500],
      icon: "💰",
    },
  ];

  const ownerListings = [
    {
      id: "1",
      title: "Modern Downtown Apartment",
      location: "Downtown, New York",
      price: 150,
      imageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      status: "available" as const,
      rating: 4.5,
      reviewCount: 128,
    },
    {
      id: "2",
      title: "Cozy Studio with City View",
      location: "Brooklyn, New York",
      price: 120,
      imageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      status: "unavailable" as const,
      rating: 4.8,
      reviewCount: 89,
    },
    {
      id: "3",
      title: "Luxury Penthouse Suite",
      location: "Manhattan, New York",
      price: 300,
      imageUrl:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      status: "available" as const,
      rating: 4.9,
      reviewCount: 67,
    },
  ];

  const recentRequests = [
    {
      id: "1",
      guest: "John Doe",
      property: "Downtown Apartment",
      date: "Dec 15",
      status: "pending" as const,
    },
    {
      id: "2",
      guest: "Jane Smith",
      property: "Studio Suite",
      date: "Dec 14",
      status: "approved" as const,
    },
    {
      id: "3",
      guest: "Mike Johnson",
      property: "Luxury Penthouse",
      date: "Dec 13",
      status: "rejected" as const,
    },
  ];

  const handleListingPress = (listingId: string) => {
    navigation.navigate("EditApartment", { listingId });
  };

  const handleViewRequests = (listingId: string) => {
    navigation.navigate("RenterRequests", { listingId });
  };

  const renderListing = ({ item }: { item: (typeof ownerListings)[0] }) => (
    <ApartmentCard
      {...item}
      onPress={() => handleListingPress(item.id)}
      onEditPress={() => handleListingPress(item.id)}
      showEditButton
      style={styles.apartmentCard}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                Hi, {user?.name?.split(" ")[0]}! 👋
              </Text>
              <Text style={styles.subtitle}>
                Manage your properties and bookings
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
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <View style={styles.statTextContainer}>
                  <Text style={[styles.statValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* My Apartments Section */}
        <View style={styles.apartmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Apartments</Text>
            <Button
              title="View All"
              onPress={() => navigation.navigate("MyListings")}
              variant="tertiary"
              size="sm"
            />
          </View>

          {ownerListings.length > 0 ? (
            <FlatList
              data={ownerListings}
              renderItem={({ item }) => (
                <Card style={styles.apartmentCard}>
                  <View style={styles.apartmentContent}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.apartmentImage}
                    />
                    <View style={styles.apartmentInfo}>
                      <Text style={styles.apartmentTitle}>{item.title}</Text>
                      <Text style={styles.apartmentLocation}>
                        {item.location}
                      </Text>
                      <View style={styles.apartmentMeta}>
                        <Text style={styles.apartmentPrice}>
                          ${item.price}/night
                        </Text>
                        <Tag
                          label={
                            item.status === "available" ? "Available" : "Booked"
                          }
                          variant={
                            item.status === "available"
                              ? "available"
                              : "unavailable"
                          }
                          size="sm"
                        />
                      </View>
                    </View>
                    <View style={styles.apartmentActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleListingPress(item.id)}
                      >
                        <Text style={styles.actionIcon}>✏️</Text>
                        <Text style={styles.actionText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleViewRequests(item.id)}
                      >
                        <Text style={styles.actionIcon}>📋</Text>
                        <Text style={styles.actionText}>Requests</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => {
                          // Handle delete
                        }}
                      >
                        <Text style={styles.actionIcon}>🗑️</Text>
                        <Text style={styles.actionText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <Card style={styles.emptyStateCard}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏠</Text>
                <Text style={styles.emptyTitle}>No apartments yet</Text>
                <Text style={styles.emptySubtitle}>
                  Add your first apartment to start renting
                </Text>
                <Button
                  title="Add New Apartment"
                  onPress={() => navigation.navigate("AddApartment")}
                  variant="primary"
                  style={styles.emptyButton}
                />
              </View>
            </Card>
          )}
        </View>

        {/* Recent Requests */}
        <Card style={styles.requestsCard}>
          <View style={styles.requestsHeader}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            <Button
              title="View All"
              onPress={() => navigation.navigate("RenterRequests")}
              variant="tertiary"
              size="sm"
            />
          </View>

          {recentRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestGuest}>{request.guest}</Text>
                <Text style={styles.requestProperty}>{request.property}</Text>
                <Text style={styles.requestDate}>{request.date}</Text>
              </View>
              <Tag label={request.status} variant={request.status} size="sm" />
            </View>
          ))}
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            onPress={logout}
            variant="error"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddApartment")}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>➕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  profileButton: {
    padding: spacing.xs,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    ...textStyles.h3,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: spacing.lg,
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    fontSize: 24,
    marginRight: spacing.md,
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
  apartmentsSection: {
    margin: spacing.lg,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  apartmentCard: {
    marginBottom: spacing.md,
  },
  apartmentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  apartmentImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[200],
    marginRight: spacing.md,
  },
  apartmentInfo: {
    flex: 1,
  },
  apartmentTitle: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  apartmentLocation: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  apartmentMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  apartmentPrice: {
    ...textStyles.caption,
    color: colors.primary[500],
    fontWeight: "600",
  },
  apartmentActions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  actionButton: {
    alignItems: "center",
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
    minWidth: 50,
  },
  deleteButton: {
    backgroundColor: colors.error[50],
  },
  actionIcon: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  actionText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontSize: 10,
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  emptyState: {
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...textStyles.body,
    color: colors.neutral[500],
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  requestsCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  requestsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  requestInfo: {
    flex: 1,
  },
  requestGuest: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  requestProperty: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  requestDate: {
    ...textStyles.caption,
    color: colors.neutral[500],
  },
  logoutContainer: {
    padding: spacing.lg,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.neutral[0],
  },
});
