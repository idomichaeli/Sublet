import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { colors, spacing, liquidGlass } from "../../constants/tokens";
import OwnerHomeScreen from "../../../features/apartments/OwnerHomeScreen";
import OwnerChatScreen from "../../../features/apartments/OwnerChatScreen";
import OwnerProfileScreen from "../../../features/apartments/OwnerProfileScreen";
import InterestedRentersScreen from "../../../features/apartments/InterestedRentersScreen";

export type OwnerBottomTabParamList = {
  Home: undefined;
  Offers: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<OwnerBottomTabParamList>();

export default function OwnerBottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Offers") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
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
        component={OwnerHomeScreen}
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Offers"
        component={InterestedRentersScreen}
        options={{
          title: "Offers",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={OwnerChatScreen}
        options={{
          title: "Chat",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={OwnerProfileScreen}
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
