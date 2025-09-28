import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { usePropertyManager } from "../../../core/services/propertyManager";
import { PropertyObject } from "../../../core/types/propertyObjects";

// Example component showing how to use the Property Manager
export default function PropertyManagerExample() {
  const propertyManager = usePropertyManager();
  const [property, setProperty] = useState<PropertyObject | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Initialize property when component mounts
  useEffect(() => {
    const newProperty = propertyManager.initializeNewProperty();
    setProperty(newProperty);
    setCompletionPercentage(propertyManager.getCompletionPercentage());
  }, []);

  // Update property data
  const updateProperty = (updates: Partial<PropertyObject>) => {
    const updatedProperty = propertyManager.updateProperty(updates);
    setProperty(updatedProperty);
    setCompletionPercentage(propertyManager.getCompletionPercentage());
  };

  // Example: Update property category
  const updateCategory = () => {
    updateProperty({
      propertyCategory: "apartment",
      propertyType: "entire_place",
    });
  };

  // Example: Update location
  const updateLocation = () => {
    updateProperty({
      street: "Dizengoff",
      streetNumber: "123",
      floor: "3",
      apartmentNumber: "A",
    });
  };

  // Example: Update basic details
  const updateBasicDetails = () => {
    updateProperty({
      bedrooms: 2,
      bathrooms: 1,
      size: 75,
      renovation: "renovated",
    });
  };

  // Example: Update amenities
  const updateAmenities = () => {
    updateProperty({
      amenities: ["wifi", "ac", "furnished", "elevator"],
    });
  };

  // Example: Update photos
  const updatePhotos = () => {
    updateProperty({
      photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],
    });
  };

  // Example: Update availability
  const updateAvailability = () => {
    updateProperty({
      availableFrom: "2024-02-01",
      availableTo: "2024-12-31",
      startDateFlexibility: "1week",
    });
  };

  // Example: Update pricing
  const updatePricing = () => {
    updateProperty({
      price: 2500,
      pricingFrequency: "month",
    });
  };

  // Example: Update contact info
  const updateContact = () => {
    updateProperty({
      name: "John Doe",
      email: "john@example.com",
      phone: "+972-50-123-4567",
    });
  };

  // Save draft
  const saveDraft = () => {
    const result = propertyManager.saveDraft();
    if (result.success) {
      Alert.alert("Success", "Draft saved successfully!");
    } else {
      Alert.alert("Error", result.errors?.join(", ") || "Failed to save");
    }
  };

  // Publish property
  const publishProperty = () => {
    const result = propertyManager.publishProperty();
    if (result.success) {
      Alert.alert("Success", "Property published successfully!");
    } else {
      Alert.alert("Error", result.errors?.join(", ") || "Failed to publish");
    }
  };

  // Validate property
  const validateProperty = () => {
    const validation = propertyManager.validateProperty();
    if (validation.isValid) {
      Alert.alert("Validation", "Property is valid!");
    } else {
      Alert.alert("Validation Errors", validation.errors.join("\n"));
    }
  };

  if (!property) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Property Manager Example</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Completion: {completionPercentage}%
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={updateCategory}>
          <Text style={styles.buttonText}>Update Category</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={updateLocation}>
          <Text style={styles.buttonText}>Update Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={updateBasicDetails}>
          <Text style={styles.buttonText}>Update Basic Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={updateAmenities}>
          <Text style={styles.buttonText}>Update Amenities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={updatePhotos}>
          <Text style={styles.buttonText}>Update Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={updateAvailability}>
          <Text style={styles.buttonText}>Update Availability</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={updatePricing}>
          <Text style={styles.buttonText}>Update Pricing</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={updateContact}>
          <Text style={styles.buttonText}>Update Contact</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={saveDraft}>
          <Text style={styles.actionButtonText}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={publishProperty}>
          <Text style={styles.actionButtonText}>Publish Property</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={validateProperty}
        >
          <Text style={styles.actionButtonText}>Validate Property</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.infoTitle}>Current Property Data:</Text>
        <Text style={styles.infoText}>
          Category: {property.propertyCategory || "Not set"}
        </Text>
        <Text style={styles.infoText}>
          Type: {property.propertyType || "Not set"}
        </Text>
        <Text style={styles.infoText}>
          Street: {property.street || "Not set"}
        </Text>
        <Text style={styles.infoText}>Bedrooms: {property.bedrooms}</Text>
        <Text style={styles.infoText}>Bathrooms: {property.bathrooms}</Text>
        <Text style={styles.infoText}>Size: {property.size}m²</Text>
        <Text style={styles.infoText}>
          Price: ${property.price}/{property.pricingFrequency}
        </Text>
        <Text style={styles.infoText}>
          Amenities: {property.amenities.length} selected
        </Text>
        <Text style={styles.infoText}>
          Photos: {property.photos.length} uploaded
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2196f3",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
  propertyInfo: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
});
