import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { colors, spacing, liquidGlass } from "../../constants/tokens";
import HomeScreen from "../../../features/swipe/HomeScreen";
import FavoritesTabScreen from "../../../features/swipe/FavoritesTabScreen";
import MyBookingsScreen from "../../../features/swipe/MyBookingsScreen";
import ProfileScreen from "../../../features/profile/ProfileScreen";
import { useFavoritesTab } from "../../../shared/hooks/state/FavoritesTabContext";

export type BottomTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const { activeTab } = useFavoritesTab();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favorites") {
            // Show different icons based on the active sub-tab
            if (activeTab === "chats") {
              iconName = focused ? "chatbubble" : "chatbubble-outline";
            } else {
              iconName = focused ? "heart" : "heart-outline";
            }
          } else if (route.name === "Bookings") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "home-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[600],
        tabBarStyle: {
          backgroundColor: colors.neutral[50],
          borderTopColor: colors.neutral[200],
          borderTopWidth: 1,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
          height: 80,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: liquidGlass.shadow.color,
          shadowOffset: liquidGlass.shadow.offset,
          shadowOpacity: liquidGlass.shadow.opacity,
          shadowRadius: liquidGlass.shadow.radius,
          elevation: liquidGlass.shadow.elevation,
          borderRadius: 40,
          marginHorizontal: 16,
          marginBottom: 16,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: colors.neutral[0],
          borderBottomColor: colors.neutral[200],
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.neutral[900],
        },
        headerTintColor: colors.primary[500],
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Browse" }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesTabScreen}
        options={{ title: "Favorites" }}
      />
      <Tab.Screen
        name="Bookings"
        component={MyBookingsScreen}
        options={{ title: "My Bookings" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
