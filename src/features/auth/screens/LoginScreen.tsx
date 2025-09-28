import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "../../../core/services/authenticationStore";
import { User } from "../../../core/types/userProfile";
import {
  colors,
  spacing,
  textStyles,
  shadows,
  borderRadius,
} from "../../../shared/constants/tokens";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const setRole = useAuthStore((s) => s.setRole);

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);

    try {
      // Simulate API call for social login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response - in real app, backend returns user with role
      const mockUser: User = {
        id: "1",
        name: provider === "Google" ? "John Google" : "Jane Apple",
        email: provider === "Google" ? "john@gmail.com" : "jane@icloud.com",
        role: "RENTER", // Backend determines this
      };

      login({ token: "mock-token", user: mockUser });
      setRole(mockUser.role);
    } catch (err) {
      Alert.alert(
        "Error",
        `Failed to login with ${provider}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    setLoading(true);

    try {
      // Simulate API call for phone login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response - in real app, backend returns user with role
      const mockUser: User = {
        id: "1",
        name: "Phone User",
        email: "user@phone.com",
        role: "RENTER", // Backend determines this
      };

      login({ token: "mock-token", user: mockUser });
      setRole(mockUser.role);
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to login with phone number. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary[400], colors.primary[50], colors.neutral[50]]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Area */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../app/assets/icon.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Welcome to Uplet</Text>
            <Text style={styles.subtitle}>Your trusted rental platform</Text>
          </View>

          {/* Login Options */}
          <View style={styles.loginSection}>
            <View style={styles.loginButtons}>
              {/* Phone Login */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                ]}
                onPress={handlePhoneLogin}
                disabled={loading}
                accessibilityLabel="Login with phone number"
              >
                <Ionicons
                  name="phone-portrait"
                  size={24}
                  color={colors.neutral[700]}
                />
                <Text style={styles.loginText}>Sign in with Phone number</Text>
              </TouchableOpacity>

              {/* Google Login */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                ]}
                onPress={() => handleSocialLogin("Google")}
                disabled={loading}
                accessibilityLabel="Login with Google"
              >
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={colors.neutral[700]}
                />
                <Text style={styles.loginText}>Sign in with Google</Text>
              </TouchableOpacity>

              {/* Apple Login */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                ]}
                onPress={() => handleSocialLogin("Apple")}
                disabled={loading}
                accessibilityLabel="Login with Apple"
              >
                <Ionicons
                  name="logo-apple"
                  size={24}
                  color={colors.neutral[700]}
                />
                <Text style={styles.loginText}>Sign in with Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{" "}
              <Text style={styles.footerLink}>Terms of Service</Text> and{" "}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing["3xl"],
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5DC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  logoImage: {
    width: 120,
    height: 140,
    marginTop: 15,
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral[900],
    marginBottom: spacing.sm,
    textAlign: "center",
    fontSize: 28,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
    fontSize: 16,
  },
  loginSection: {
    marginBottom: spacing["2xl"],
  },
  loginButtons: {
    gap: spacing.md,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neutral[0],
    ...shadows.md,
    minHeight: 56,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginText: {
    ...textStyles.button,
    color: colors.neutral[700],
    fontSize: 16,
    marginLeft: spacing.md,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  footerText: {
    ...textStyles.caption,
    color: colors.neutral[500],
    textAlign: "center",
    lineHeight: 20,
  },
  footerLink: {
    color: colors.primary[500],
    fontWeight: "600",
  },
});
