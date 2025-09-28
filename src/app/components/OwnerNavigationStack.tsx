import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OwnerMainTabNavigator from "./OwnerMainTabNavigator";
import { AddPropertyScreen } from "../../features/apartments/addProperty";
import {
  EditApartmentScreen,
  RenterRequestsScreen,
  PaymentsScreen,
} from "../../features/apartments";
import PropertyDetailsScreen from "../../features/apartments/screens/PropertyDetailsScreen";

export type OwnerStackParamList = {
  OwnerTabs: undefined;
  AddApartment: undefined;
  EditApartment: { listingId?: string } | undefined;
  RenterRequests: undefined;
  Payments: undefined;
  PropertyDetails: { property: any };
};

const Stack = createNativeStackNavigator<OwnerStackParamList>();

export default function OwnerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OwnerTabs"
        component={OwnerMainTabNavigator}
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
      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
