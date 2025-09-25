import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EditApartmentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add / Edit Apartment</Text>
      <Text>Form to create or edit an apartment.</Text>
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
