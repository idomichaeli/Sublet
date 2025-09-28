import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppNavigator } from "./src";
import { LogBox } from "react-native";

// Suppress the topSvgLayout error from react-native-svg
LogBox.ignoreLogs([
  'Unsupported top level event type "topSvgLayout" dispatched',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
