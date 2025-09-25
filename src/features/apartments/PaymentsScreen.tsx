import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PaymentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payments & History</Text>
      <Text>Payment history and payouts overview.</Text>
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
