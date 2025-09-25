import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";
import ListingDetailsScreen from "../../../features/swipe/ListingDetailsScreen";
import BookingScreen from "../../../features/swipe/BookingScreen";
import ChatScreen from "../../../features/swipe/ChatScreen";
import ChatDetailScreen from "../../../features/favorites/ChatDetailScreen";
import AreaDetailsScreen from "../../../features/swipe/AreaDetailsScreen";
import { colors, textStyles } from "../../constants/tokens";
import { FavoritesTabProvider } from "../../hooks/state/FavoritesTabContext";
import { TelAvivLocation } from "../../constants/locations";
import { SwipeCardData } from "../../../features/swipe/components/SwipeCard";

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
  AreaDetails: { area: TelAvivLocation; apartments: SwipeCardData[] };
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
          component={BottomTabNavigator}
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
