import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";
import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";
import { useAuthStore } from "../../../core/services/authenticationStore";
import { UserRole } from "../../../core/types/userProfile";

export default function ProfileScreen() {
  const { user, logout, role, setRole } = useAuthStore();

  const handleRoleSwitch = (newRole: UserRole) => {
    Alert.alert(
      "Switch Role",
      `Are you sure you want to switch to ${
        newRole === "OWNER" ? "Owner" : "Renter"
      } mode?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Switch",
          onPress: () => setRole(newRole),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || "U"}
              </Text>
            </View>
          </View>

          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.email}>{user?.email || "user@example.com"}</Text>
          <Text style={styles.role}>
            {role === "OWNER" ? "Owner" : "Renter"}
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.roleSwitchContainer}>
            <View style={styles.roleSwitchTextContainer}>
              <Text style={styles.roleSwitchLabel}>
                Switch to {role === "OWNER" ? "Renter" : "Owner"} Mode
              </Text>
              <Text style={styles.roleSwitchDescription}>
                {role === "OWNER"
                  ? "Switch to renter mode to browse and book apartments"
                  : "Switch to owner mode to manage your properties"}
              </Text>
            </View>
            <Switch
              value={role === "OWNER"}
              onValueChange={(value) =>
                handleRoleSwitch(value ? "OWNER" : "RENTER")
              }
              trackColor={{
                false: colors.neutral[300],
                true: colors.primary[200],
              }}
              thumbColor={
                role === "OWNER" ? colors.primary[500] : colors.neutral[500]
              }
            />
          </View>

          <Button
            title="Edit Profile"
            onPress={() => {}}
            variant="secondary"
            style={styles.settingButton}
          />
          <Button
            title="Payment Methods"
            onPress={() => {}}
            variant="secondary"
            style={styles.settingButton}
          />
          <Button
            title="Notifications"
            onPress={() => {}}
            variant="secondary"
            style={styles.settingButton}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Button
            title="Help Center"
            onPress={() => {}}
            variant="tertiary"
            style={styles.settingButton}
          />
          <Button
            title="Contact Us"
            onPress={() => {}}
            variant="tertiary"
            style={styles.settingButton}
          />
        </Card>

        <Button
          title="Sign Out"
          onPress={logout}
          variant="error"
          style={styles.logoutButton}
        />
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
  header: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral[900],
  },
  profileCard: {
    margin: spacing.lg,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...textStyles.h1,
    color: colors.neutral[0],
  },
  name: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  email: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  role: {
    ...textStyles.caption,
    color: colors.primary[500],
    fontWeight: "600",
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  settingButton: {
    marginBottom: spacing.sm,
  },
  roleSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  roleSwitchTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  roleSwitchLabel: {
    ...textStyles.body,
    fontWeight: "600",
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  roleSwitchDescription: {
    ...textStyles.caption,
    color: colors.neutral[600],
    lineHeight: 16,
  },
  logoutButton: {
    margin: spacing.lg,
  },
});
