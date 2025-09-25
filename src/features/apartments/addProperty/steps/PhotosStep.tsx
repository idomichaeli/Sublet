import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  textStyles,
} from "../../../../shared/constants/tokens";
import ImageUpload from "../../../../shared/components/ui/ImageUpload";
import { StepProps } from "../types/PropertyData";

export default function PhotosStep({ data, onUpdate }: StepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photos</Text>
      <Text style={styles.subtitle}>
        Add photos to showcase your property. High-quality photos help attract
        more renters.
      </Text>

      <View style={styles.photoTips}>
        <Text style={styles.tipsTitle}>📸 Photo Tips:</Text>
        <Text style={styles.tipText}>• Take photos in good lighting</Text>
        <Text style={styles.tipText}>• Show different rooms and angles</Text>
        <Text style={styles.tipText}>
          • Include outdoor spaces if available
        </Text>
        <Text style={styles.tipText}>• Keep rooms clean and tidy</Text>
      </View>

      <ImageUpload
        images={data.photos}
        onImagesChange={(photos) => onUpdate({ photos })}
        maxImages={15}
      />

      {data.photos.length > 0 && (
        <View style={styles.photoCount}>
          <Text style={styles.photoCountText}>
            {data.photos.length} photos uploaded
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...textStyles.h2,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.lg,
  },
  photoTips: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  tipsTitle: {
    ...textStyles.body,
    color: colors.primary[700],
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  tipText: {
    ...textStyles.caption,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  photoCount: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.success[50],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  photoCountText: {
    ...textStyles.caption,
    color: colors.success[700],
    fontWeight: "600",
    textAlign: "center",
  },
});
