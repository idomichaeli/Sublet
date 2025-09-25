import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../shared/hooks/state/authStore";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../shared/constants/tokens";
import Card from "../../shared/components/ui/Card";
import ProfileActionItem from "./components/ProfileActionItem";
import Toggle from "../../shared/components/ui/Toggle";

export default function OwnerProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);

  const handleMyProperties = () => {
    navigation.navigate("Home");
  };

  const handlePaymentInfo = () => {
    Alert.alert("Payment Info", "Payment information management coming soon!");
  };

  const handleNotifications = () => {
    Alert.alert("Notifications", "Notification preferences coming soon!");
  };

  const handleSupport = () => {
    Alert.alert("Support", "Support & Help coming soon!");
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing coming soon!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={handleEditProfile}
            >
              <View style={styles.profileImage}>
                <Text style={styles.profileInitial}>
                  {user?.name?.charAt(0) || "U"}
                </Text>
              </View>
              <View style={styles.editBadge}>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "Owner"}</Text>
              <Text style={styles.profileEmail}>
                {user?.email || "owner@example.com"}
              </Text>
              <View style={styles.verificationBadge}>
                <Text style={styles.verificationIcon}>✓</Text>
                <Text style={styles.verificationText}>Verified Owner</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Action Items */}
        <View style={styles.actionsSection}>
          <ProfileActionItem
            icon="🏠"
            title="My Properties"
            subtitle="Manage your rental properties"
            onPress={handleMyProperties}
          />

          <ProfileActionItem
            icon="💳"
            title="Payment Info"
            subtitle="Bank account and payment methods"
            onPress={handlePaymentInfo}
          />

          <ProfileActionItem
            icon="🔔"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={handleNotifications}
          />

          <Card style={styles.darkModeCard}>
            <View style={styles.darkModeContainer}>
              <View style={styles.darkModeInfo}>
                <Text style={styles.darkModeIcon}>🌙</Text>
                <View style={styles.darkModeText}>
                  <Text style={styles.darkModeTitle}>Dark Mode</Text>
                  <Text style={styles.darkModeSubtitle}>
                    {darkMode ? "Enabled" : "Disabled"}
                  </Text>
                </View>
              </View>
              <Toggle value={darkMode} onValueChange={setDarkMode} size="md" />
            </View>
          </Card>

          <ProfileActionItem
            icon="📞"
            title="Support & Help"
            subtitle="Get help and contact support"
            onPress={handleSupport}
          />

          <ProfileActionItem
            icon="🚪"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            showArrow={false}
            style={[styles.logoutItem, { backgroundColor: colors.error[50] }]}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Uplet v1.0.0</Text>
          <Text style={styles.appCopyright}>
            © 2024 Uplet. All rights reserved.
          </Text>
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
  },
  scrollContent: {
    paddingBottom: 120, // Extra padding for floating nav bar (80px height + 16px margin + 24px extra)
  },
  profileCard: {
    margin: spacing.lg,
    marginTop: spacing.xl,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: spacing.lg,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    ...textStyles.h1,
    color: colors.neutral[0],
    fontWeight: "600",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral[0],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  editIcon: {
    fontSize: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  verificationIcon: {
    fontSize: 14,
    color: colors.success[600],
    marginRight: spacing.xs,
  },
  verificationText: {
    ...textStyles.caption,
    color: colors.success[700],
    fontWeight: "500",
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
  },
  darkModeCard: {
    marginBottom: spacing.sm,
  },
  darkModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  darkModeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  darkModeIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  darkModeText: {
    flex: 1,
  },
  darkModeTitle: {
    ...textStyles.body,
    color: colors.neutral[900],
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  darkModeSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  logoutItem: {
    borderColor: colors.error[500],
    borderWidth: 1,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  appVersion: {
    ...textStyles.caption,
    color: colors.neutral[500],
    marginBottom: spacing.xs,
  },
  appCopyright: {
    ...textStyles.caption,
    color: colors.neutral[400],
    textAlign: "center",
  },
});
