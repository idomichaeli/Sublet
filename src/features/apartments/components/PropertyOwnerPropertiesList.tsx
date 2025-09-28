import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../shared/constants/tokens";

interface Property {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  status: "available" | "booked" | "draft";
  views: number;
  interests: number;
  price: number;
  rating: number;
  nextBooking: string;
}

interface PropertyOwnerPropertiesListProps {
  properties: Property[];
  expandedCards: Set<string>;
  onPropertyPress: (propertyId: string) => void;
  onEditProperty: (propertyId: string) => void;
  onViewRenters: (propertyId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  onToggleCardExpansion: (cardId: string) => void;
}

export default function PropertyOwnerPropertiesList({
  properties,
  expandedCards,
  onPropertyPress,
  onEditProperty,
  onViewRenters,
  onDeleteProperty,
  onToggleCardExpansion,
}: PropertyOwnerPropertiesListProps) {
  const getButtonState = (item: Property) => {
    if (item.status === "available") return "available";
    if (item.status === "booked") return "booked";
    if (item.status === "draft") return "draft";
    return "available";
  };

  const getButtonStyle = (state: string) => {
    switch (state) {
      case "available":
        return styles.availableButton;
      case "booked":
        return styles.bookedButton;
      case "draft":
        return styles.draftButton;
      default:
        return styles.availableButton;
    }
  };

  const getButtonTextStyle = (state: string) => {
    switch (state) {
      case "available":
        return styles.availableButtonText;
      case "booked":
        return styles.bookedButtonText;
      case "draft":
        return styles.draftButtonText;
      default:
        return styles.availableButtonText;
    }
  };

  const getButtonText = (state: string) => {
    switch (state) {
      case "available":
        return "Available";
      case "booked":
        return "Booked";
      case "draft":
        return "Draft";
      default:
        return "Available";
    }
  };

  const renderProperty = ({ item }: { item: Property }) => {
    const buttonState = getButtonState(item);
    const isExpanded = expandedCards.has(item.id);

    return (
      <TouchableOpacity
        style={styles.propertyCard}
        onPress={() => onPropertyPress(item.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.propertyImage} />
        <View style={styles.propertyContent}>
          <View style={styles.propertyHeader}>
            <Text style={styles.propertyTitle}>{item.title}</Text>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => onToggleCardExpansion(item.id)}
            >
              <Text style={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.propertyLocation}>{item.location}</Text>

          <View style={styles.propertyStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.views}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.interests}</Text>
              <Text style={styles.statLabel}>Interests</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${item.price}</Text>
              <Text style={styles.statLabel}>Price</Text>
            </View>
          </View>

          <View style={styles.propertyFooter}>
            <TouchableOpacity
              style={[styles.statusButton, getButtonStyle(buttonState)]}
              onPress={() => {}}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  getButtonTextStyle(buttonState),
                ]}
              >
                {getButtonText(buttonState)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.nextBooking}>{item.nextBooking}</Text>
          </View>

          {isExpanded && (
            <View style={styles.expandedActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEditProperty(item.id)}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onViewRenters(item.id)}
              >
                <Text style={styles.actionButtonText}>View Renters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDeleteProperty(item.id)}
              >
                <Text
                  style={[styles.actionButtonText, styles.deleteButtonText]}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Properties</Text>
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.propertiesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  propertiesList: {
    paddingBottom: spacing.xl,
  },
  propertyCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.sm,
  },
  propertyImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  propertyContent: {
    padding: spacing.md,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  propertyTitle: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
    flex: 1,
  },
  expandButton: {
    padding: spacing.xs,
  },
  expandIcon: {
    ...textStyles.body,
    color: colors.neutral[500],
  },
  propertyLocation: {
    ...textStyles.body,
    color: colors.neutral[600],
    marginBottom: spacing.md,
  },
  propertyStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.md,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    ...textStyles.body,
    fontWeight: "600",
    color: colors.neutral[800],
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  propertyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  availableButton: {
    backgroundColor: colors.success[100],
  },
  bookedButton: {
    backgroundColor: colors.warning[100],
  },
  draftButton: {
    backgroundColor: colors.neutral[200],
  },
  statusButtonText: {
    ...textStyles.caption,
    fontWeight: "600",
  },
  availableButtonText: {
    color: colors.success[700],
  },
  bookedButtonText: {
    color: colors.warning[700],
  },
  draftButtonText: {
    color: colors.neutral[600],
  },
  nextBooking: {
    ...textStyles.caption,
    color: colors.neutral[500],
  },
  expandedActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[100],
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: colors.error[100],
  },
  actionButtonText: {
    ...textStyles.caption,
    fontWeight: "600",
    color: colors.primary[700],
  },
  deleteButtonText: {
    color: colors.error[700],
  },
});
