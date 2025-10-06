import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  colors,
  spacing,
  textStyles,
  liquidGlass,
  withOpacity,
} from "../../../shared/constants/tokens";
import {
  LiquidGlassCard,
  LiquidGlassButton,
  LiquidGlassSection,
  LiquidGlassAvatar,
} from "../../../shared/components/ui";
import { useAuthStore } from "../../../core/services/authenticationStore";

export default function RenterProfileScreen() {
  const { user, logout, role, setRole } = useAuthStore();

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

  const handleSwitchToOwner = () => {
    Alert.alert(
      "Switch to Owner Mode",
      "Switch to owner mode to manage your properties?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Switch",
          onPress: () => setRole("OWNER"),
        },
      ]
    );
  };

  const quickActions = [
    {
      title: "Browse Properties",
      subtitle: "Discover new places",
      icon: "🔍",
      onPress: () => console.log("Browse Properties"),
    },
    {
      title: "My Bookings",
      subtitle: "View your reservations",
      icon: "📋",
      onPress: () => console.log("My Bookings"),
    },
    {
      title: "Favorites",
      subtitle: "Your saved properties",
      icon: "❤️",
      onPress: () => console.log("Favorites"),
    },
    {
      title: "Messages",
      subtitle: "Chat with owners",
      icon: "💬",
      onPress: () => console.log("Messages"),
    },
  ];

  const preferences = [
    {
      title: "Location Preferences",
      subtitle: "Set your preferred areas",
      icon: "📍",
      onPress: () => console.log("Location Preferences"),
    },
    {
      title: "Budget Range",
      subtitle: "Manage your budget settings",
      icon: "💰",
      onPress: () => console.log("Budget Range"),
    },
    {
      title: "Property Type",
      subtitle: "Choose your preferred types",
      icon: "🏠",
      onPress: () => console.log("Property Type"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          withOpacity(colors.secondary[500], "10"),
          withOpacity(colors.secondary[600], "20"),
          withOpacity(colors.neutral[0], "95"),
        ]}
        style={styles.backgroundGradient}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <LiquidGlassCard
          variant="light"
          style={styles.headerCard}
          gradientColors={[
            withOpacity(colors.secondary[500], "15"),
            withOpacity(colors.secondary[600], "25"),
          ]}
        >
          <View style={styles.headerContent}>
            <LiquidGlassAvatar
              name={user?.name}
              size="xl"
              variant="medium"
              showGradient={true}
              gradientColors={[
                withOpacity(colors.secondary[500], "20"),
                withOpacity(colors.secondary[600], "30"),
              ]}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "Renter"}</Text>
              <Text style={styles.userEmail}>
                {user?.email || "renter@example.com"}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Renter</Text>
              </View>
            </View>
          </View>
        </LiquidGlassCard>

        {/* Quick Actions */}
        <LiquidGlassSection
          title="Quick Actions"
          subtitle="Explore and manage your rentals"
          variant="medium"
          showGradient={true}
          style={styles.actionsSection}
        >
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <LiquidGlassCard
                key={index}
                variant="light"
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View style={styles.actionContent}>
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
              </LiquidGlassCard>
            ))}
          </View>
        </LiquidGlassSection>

        {/* Preferences */}
        <LiquidGlassSection
          title="Preferences"
          subtitle="Customize your search experience"
          variant="medium"
          showGradient={true}
          style={styles.preferencesSection}
        >
          <View style={styles.preferencesList}>
            {preferences.map((preference, index) => (
              <LiquidGlassCard
                key={index}
                variant="light"
                style={styles.preferenceCard}
                onPress={preference.onPress}
              >
                <View style={styles.preferenceContent}>
                  <Text style={styles.preferenceIcon}>{preference.icon}</Text>
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>
                      {preference.title}
                    </Text>
                    <Text style={styles.preferenceSubtitle}>
                      {preference.subtitle}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </LiquidGlassCard>
            ))}
          </View>
        </LiquidGlassSection>

        {/* Account Settings */}
        <LiquidGlassSection
          title="Account"
          variant="medium"
          showGradient={true}
          style={styles.settingsSection}
        >
          <View style={styles.settingsList}>
            <LiquidGlassButton
              label="Switch to Owner Mode"
              icon="🏠"
              variant="secondary"
              size="md"
              fullWidth={true}
              onPress={handleSwitchToOwner}
              style={styles.settingButton}
            />
            <LiquidGlassButton
              label="Account Settings"
              icon="⚙️"
              variant="ghost"
              size="md"
              fullWidth={true}
              onPress={() => console.log("Account Settings")}
              style={styles.settingButton}
            />
            <LiquidGlassButton
              label="Help & Support"
              icon="❓"
              variant="ghost"
              size="md"
              fullWidth={true}
              onPress={() => console.log("Help & Support")}
              style={styles.settingButton}
            />
            <LiquidGlassButton
              label="Sign Out"
              icon="🚪"
              variant="error"
              size="md"
              fullWidth={true}
              onPress={handleLogout}
              style={styles.settingButton}
            />
          </View>
        </LiquidGlassSection>

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
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  headerCard: {
    marginBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  userName: {
    ...textStyles.h2,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: withOpacity(colors.secondary[500], "20"),
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: liquidGlass.radius.md,
  },
  roleText: {
    ...textStyles.caption,
    color: colors.secondary[600],
    fontWeight: "600",
  },
  actionsSection: {
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: "45%",
  },
  actionContent: {
    alignItems: "center",
    padding: spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionTitle: {
    ...textStyles.h4,
    color: colors.neutral[800],
    fontWeight: "600",
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  actionSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
    textAlign: "center",
  },
  preferencesSection: {
    marginBottom: spacing.lg,
  },
  preferencesList: {
    gap: spacing.sm,
  },
  preferenceCard: {
    marginBottom: spacing.sm,
  },
  preferenceContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  preferenceIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    ...textStyles.h4,
    color: colors.neutral[800],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  preferenceSubtitle: {
    ...textStyles.caption,
    color: colors.neutral[600],
  },
  chevron: {
    fontSize: 20,
    color: colors.neutral[400],
  },
  settingsSection: {
    marginBottom: spacing.lg,
  },
  settingsList: {
    gap: spacing.md,
  },
  settingButton: {
    marginBottom: spacing.sm,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
