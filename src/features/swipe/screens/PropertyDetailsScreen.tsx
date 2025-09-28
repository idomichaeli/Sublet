import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function ListingDetailsScreen({ navigation, route }: any) {
  const { listingId } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apartment Details</Text>
      <Text>Listing ID: {listingId}</Text>
      <View style={{ height: 8 }} />
      <Button
        title="Book Now"
        onPress={() => navigation.navigate("Booking", { listingId })}
      />
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
