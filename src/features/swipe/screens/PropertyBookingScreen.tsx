import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BookingScreen({ route }: any) {
  const { listingId } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking & Checkout</Text>
      <Text>Booking for listing: {listingId}</Text>
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
