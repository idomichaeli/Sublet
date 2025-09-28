import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthenticationStack from "./AuthenticationStack";
import OwnerNavigationStack from "./OwnerNavigationStack";
import RenterNavigationStack from "./RenterNavigationStack";
import { useAuthStore } from "../../core/services/authenticationStore";
import { UserRole } from "../../core/types/userProfile";

export type RootStackParamList = {
  Auth: undefined;
  Owner: undefined;
  Renter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated, role, setRole } = useAuthStore();

  // For testing - bypass authentication
  const bypassAuth = true; // Set to false to show auth flow

  // Set default role for testing if none is set
  React.useEffect(() => {
    if (bypassAuth && !role) {
      setRole("RENTER");
    }
  }, [bypassAuth, role, setRole]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!bypassAuth && !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthenticationStack} />
        ) : role === ("OWNER" as UserRole) ? (
          <Stack.Screen name="Owner" component={OwnerNavigationStack} />
        ) : (
          <Stack.Screen name="Renter" component={RenterNavigationStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
