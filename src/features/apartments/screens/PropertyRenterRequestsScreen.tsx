import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RenterRequestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renter Requests</Text>
      <Text>List of pending and past renter requests.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 16 },
});
