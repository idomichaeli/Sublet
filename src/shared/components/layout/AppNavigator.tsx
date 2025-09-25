import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import OwnerStack from "./OwnerStack";
import RenterStack from "./RenterStack";
import { useAuthStore } from "../../hooks/state/authStore";
import { UserRole } from "../../types/user";

export type RootStackParamList = {
  Auth: undefined;
  Owner: undefined;
  Renter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : role === ("OWNER" as UserRole) ? (
          <Stack.Screen name="Owner" component={OwnerStack} />
        ) : (
          <Stack.Screen name="Renter" component={RenterStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
