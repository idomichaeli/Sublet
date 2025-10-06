import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RenterBottomTabNavigator from "./RenterBottomTabNavigator";
import {
  ListingDetailsScreen,
  BookingScreen,
  ChatScreen,
  AreaDetailsScreen,
} from "../../features/swipe";
import { ChatDetailScreen } from "../../features/favorites";
import { colors, textStyles } from "../../shared/constants/tokens";
import { FavoritesTabProvider } from "../../core/services/FavoritesTabContext";
import { TelAvivLocation } from "../../shared/constants/locations";
import { SwipeCardData } from "../../features/swipe/components/SwipeCard";

export type RenterStackParamList = {
  MainTabs: undefined;
  ListingDetails: { listingId: string };
  Booking: { listingId: string };
  Chat: { userId: string } | undefined;
  ChatDetail: {
    chatId: string;
    listing: SwipeCardData;
    propertyTitle: string;
    propertyImage: string;
    location: string;
  };
  AreaDetails: { area: typeof TelAvivLocation; apartments: SwipeCardData[] };
};

const Stack = createNativeStackNavigator<RenterStackParamList>();

export default function RenterStack() {
  return (
    <FavoritesTabProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.neutral[0],
          },
          headerTitleStyle: {
            ...textStyles.h3,
            color: colors.neutral[900],
          },
          headerTintColor: colors.primary[500],
          headerBackTitle: "",
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={RenterBottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListingDetails"
          component={ListingDetailsScreen}
          options={{ title: "Apartment Details" }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: "Book Apartment" }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: "Chat" }}
        />
        <Stack.Screen
          name="ChatDetail"
          component={ChatDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AreaDetails"
          component={AreaDetailsScreen}
          options={{ title: "Area Details" }}
        />
      </Stack.Navigator>
    </FavoritesTabProvider>
  );
}
