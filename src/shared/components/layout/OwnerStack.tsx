import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OwnerHomeScreen from "../../../features/apartments/screens/PropertyOwnerHomeScreen";

export type OwnerStackParamList = {
  OwnerHome: undefined;
};

const Stack = createNativeStackNavigator<OwnerStackParamList>();

export default function OwnerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerHome" component={OwnerHomeScreen} />
    </Stack.Navigator>
  );
}
