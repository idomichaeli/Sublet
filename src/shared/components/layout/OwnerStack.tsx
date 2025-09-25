import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OwnerBottomTabNavigator from "./OffersTabNavigator";
import { AddPropertyScreen } from "../../../features/apartments/addProperty";
import EditApartmentScreen from "../../../features/apartments/EditApartmentScreen";
import RenterRequestsScreen from "../../../features/apartments/RenterRequestsScreen";
import PaymentsScreen from "../../../features/apartments/PaymentsScreen";

export type OwnerStackParamList = {
  OwnerTabs: undefined;
  AddApartment: undefined;
  EditApartment: { listingId?: string } | undefined;
  RenterRequests: undefined;
  Payments: undefined;
};

const Stack = createNativeStackNavigator<OwnerStackParamList>();

export default function OwnerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OwnerTabs"
        component={OwnerBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddApartment"
        component={AddPropertyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditApartment"
        component={EditApartmentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RenterRequests"
        component={RenterRequestsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
