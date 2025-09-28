import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  textStyles,
  shadows,
} from "../../../shared/constants/tokens";

// Dynamic import to handle missing native module gracefully
let ImagePicker: any = null;
try {
  ImagePicker = require("expo-image-picker");
} catch (error) {
  console.warn("expo-image-picker not available:", error);
}

// Mock data for development/testing
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560448204-17c6bbd22c8b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560448204-5c1a3b24bce1?w=400&h=300&fit=crop",
];

export interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  style?: any;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  style,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    if (!ImagePicker) {
      Alert.alert(
        "Not Available",
        "Image picker is not available in this environment."
      );
      return false;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your photo library to upload images."
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    if (!ImagePicker) {
      Alert.alert(
        "Not Available",
        "Camera is not available in this environment."
      );
      return false;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your camera to take photos."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (!ImagePicker) {
      Alert.alert(
        "Not Available",
        "Image picker is not available in this environment."
      );
      return;
    }

    if (images.length >= maxImages) {
      Alert.alert(
        "Limit Reached",
        `You can only upload up to ${maxImages} images.`
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImagesChange([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    if (!ImagePicker) {
      Alert.alert(
        "Not Available",
        "Camera is not available in this environment."
      );
      return;
    }

    if (images.length >= maxImages) {
      Alert.alert(
        "Limit Reached",
        `You can only upload up to ${maxImages} images.`
      );
      return;
    }

    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImagesChange([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const addMockImage = () => {
    if (images.length >= maxImages) {
      Alert.alert(
        "Limit Reached",
        `You can only upload up to ${maxImages} images.`
      );
      return;
    }

    const randomImage =
      MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
    onImagesChange([...images, randomImage]);
  };

  const showImageOptions = () => {
    if (!ImagePicker) {
      // Development mode - use mock images
      Alert.alert(
        "Development Mode",
        "Image picker not available. Would you like to add a sample photo for testing?",
        [
          { text: "Add Sample Photo", onPress: addMockImage },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    Alert.alert("Add Photo", "Choose how you'd like to add a photo", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        Photos ({images.length}/{maxImages})
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.imageContainer}>
          {/* Upload Button */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={showImageOptions}
            disabled={loading || images.length >= maxImages}
          >
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>
              {loading ? "Uploading..." : "Add Photo"}
            </Text>
          </TouchableOpacity>

          {/* Image Previews */}
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeIcon}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {images.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Add photos to showcase your apartment
          </Text>
          <Text style={styles.emptySubtext}>
            High-quality photos help attract more renters
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  label: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  scrollView: {
    marginBottom: spacing.sm,
  },
  imageContainer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  uploadButton: {
    width: 120,
    height: 120,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  uploadText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    textAlign: "center",
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[200],
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error[500],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  removeIcon: {
    color: colors.neutral[0],
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...textStyles.body,
    color: colors.neutral[600],
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...textStyles.caption,
    color: colors.neutral[500],
    textAlign: "center",
  },
});
