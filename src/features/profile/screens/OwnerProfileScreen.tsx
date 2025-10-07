import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  textStyles,
  withOpacity,
} from "../../../shared/constants/tokens";
import { LiquidGlassAvatar } from "../../../shared/components/ui";
import { useAuthStore } from "../../../core/services/authenticationStore";

export default function OwnerProfileScreen() {
  const { user, logout, role, setRole } = useAuthStore();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const handleSwitchToRenter = () => {
    Alert.alert(
      "Switch to Renter Mode",
      "Switch to renter mode to browse and book properties?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Switch",
          onPress: () => setRole("RENTER"),
        },
      ]
    );
  };

  const handleContactSupport = () => {
    console.log("Contact Support");
  };

  const handleEditContact = () => {
    console.log("Edit Contact Information");
  };

  const handleLanguagePress = () => {
    console.log("Language Settings");
  };

  const handlePrivacySecurity = () => {
    console.log("Privacy & Security");
  };

  const handlePaymentMethods = () => {
    console.log("Payment Methods");
  };

  const handleAccountSettings = () => {
    console.log("Account Settings");
  };

  const handleHelpSupport = () => {
    console.log("Help & Support");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <LiquidGlassAvatar
                name={user?.name}
                size="xl"
                variant="medium"
                showGradient={true}
                gradientColors={[
                  withOpacity(colors.primary[500], "20"),
                  withOpacity(colors.primary[600], "30"),
                ]}
              />
              <View style={styles.onlineStatus} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.name || "Property Owner"}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.neutral[600]}
                />
                <Text style={styles.locationText}>New York, NY</Text>
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color={colors.warning[500]} />
                <Text style={styles.ratingText}>4.8 (89 reviews)</Text>
              </View>
            </View>
            <View style={styles.accountIcon}>
              <Ionicons
                name="person-circle"
                size={24}
                color={colors.primary[500]}
              />
            </View>
          </View>

          {/* Account Summary Card */}
          <View style={styles.accountSummaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Member since</Text>
              <Text style={styles.summaryValue}>January 2021</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Properties listed</Text>
              <Text style={styles.summaryValue}>12</Text>
            </View>
          </View>
        </View>

        {/* Contact & Verification Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.primary[500]}
            />
            <Text style={styles.sectionTitle}>Contact & Verification</Text>
          </View>

          <View style={styles.contactItem}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>
                {user?.email || "owner@example.com"}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Ionicons
              name="call-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+1 (555) 987-6543</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          <View style={styles.contactActions}>
            <TouchableOpacity
              style={styles.contactSupportButton}
              onPress={handleContactSupport}
            >
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={colors.neutral[0]}
              />
              <Text style={styles.contactSupportText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editContactButton}
              onPress={handleEditContact}
            >
              <Text style={styles.editContactText}>
                Edit Contact Information
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.preferenceItem}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.preferenceLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{
                false: colors.neutral[300],
                true: colors.primary[500],
              }}
              thumbColor={colors.neutral[0]}
            />
          </View>

          <View style={styles.preferenceItem}>
            <Ionicons
              name="moon-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.preferenceLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: colors.neutral[300],
                true: colors.primary[500],
              }}
              thumbColor={colors.neutral[0]}
            />
          </View>

          <TouchableOpacity
            style={styles.preferenceItem}
            onPress={handleLanguagePress}
          >
            <Ionicons
              name="globe-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Language</Text>
              <Text style={styles.preferenceSubtext}>English</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.accountItem}
            onPress={handleSwitchToRenter}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.primary[500]}
            />
            <Text style={[styles.accountLabel, { color: colors.primary[500] }]}>
              Switch to Renter Mode
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accountItem}
            onPress={handlePrivacySecurity}
          >
            <Ionicons
              name="shield-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.accountLabel}>Privacy & Security</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accountItem}
            onPress={handlePaymentMethods}
          >
            <Ionicons
              name="card-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.accountLabel}>Payment Methods</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accountItem}
            onPress={handleAccountSettings}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.accountLabel}>Account Settings</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity
            style={styles.supportItem}
            onPress={handleHelpSupport}
          >
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.supportLabel}>Help & Support</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportItem} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.neutral[600]}
            />
            <Text style={styles.supportLabel}>Log Out</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.neutral[400]}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  },
  scrollContent: {
    padding: spacing.lg,
  },

  // Profile Header Styles
  profileHeader: {
    marginBottom: spacing.lg,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  onlineStatus: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success[500],
    borderWidth: 2,
    borderColor: colors.neutral[0],
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  locationText: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginLeft: spacing.xs,
  },
  accountIcon: {
    padding: spacing.xs,
  },
  accountSummaryCard: {
    backgroundColor: withOpacity(colors.primary[500], "10"),
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...textStyles.h4,
    color: colors.primary[600],
    fontWeight: "600",
  },

  // Section Card Styles
  sectionCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[800],
    marginLeft: spacing.sm,
    fontWeight: "600",
  },

  // Contact & Verification Styles
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  contactInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  contactLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  contactValue: {
    ...textStyles.body,
    color: colors.neutral[800],
  },
  verifiedBadge: {
    backgroundColor: colors.success[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  verifiedText: {
    ...textStyles.caption,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  contactActions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  contactSupportButton: {
    backgroundColor: colors.primary[500],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: 8,
  },
  contactSupportText: {
    ...textStyles.button,
    color: colors.neutral[0],
    marginLeft: spacing.sm,
  },
  editContactButton: {
    backgroundColor: colors.neutral[100],
    alignItems: "center",
    padding: spacing.md,
    borderRadius: 8,
  },
  editContactText: {
    ...textStyles.button,
    color: colors.primary[500],
  },

  // Preferences Styles
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  preferenceInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  preferenceLabel: {
    ...textStyles.body,
    color: colors.neutral[800],
    fontWeight: "500",
  },
  preferenceSubtext: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },

  // Account & Support Styles
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  accountLabel: {
    ...textStyles.body,
    color: colors.neutral[800],
    flex: 1,
    marginLeft: spacing.md,
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  supportLabel: {
    ...textStyles.body,
    color: colors.neutral[800],
    flex: 1,
    marginLeft: spacing.md,
  },

  bottomSpacing: {
    height: spacing.xl,
  },
});
