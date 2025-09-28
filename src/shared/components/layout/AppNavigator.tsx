import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import OwnerStack from "./OwnerStack";
import RenterNavigationStack from "../../../app/components/RenterNavigationStack";
import { useAuthStore } from "../../hooks/state/authStore";
import { UserRole } from "../../types/user";

export type RootStackParamList = {
  Auth: undefined;
  Owner: undefined;
  Renter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, user } = useAuthStore();

  // For testing - bypass authentication and show renter stack
  const showRenterStack = true; // Set to false to show auth flow

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!showRenterStack && !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !showRenterStack && user?.role === ("OWNER" as UserRole) ? (
          <Stack.Screen name="Owner" component={OwnerStack} />
        ) : (
          <Stack.Screen name="Renter" component={RenterNavigationStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
