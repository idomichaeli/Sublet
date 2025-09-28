import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../../shared/constants/tokens";
import { StepProps, PropertyType } from "../types/PropertyCreationData";
import { Svg, Path } from "react-native-svg";

// Custom House Image Component (for entire place)
const HouseIcon = ({ size, color }: { size: number; color: string }) => (
  <Image
    source={require("../../../app/assets/icon.png")}
    style={{ width: size * 3, height: size * 3 }}
    resizeMode="contain"
  />
);

// Custom Door SVG Component (for room)
const DoorIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 21H21M5 21V3H19V21M9 9H15M9 13H15"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

// Custom People SVG Component (for shared room)
const PeopleIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7ZM23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

const PROPERTY_TYPES = [
  {
    id: "entire_place" as PropertyType,
    label: "An entire place",
    icon: HouseIcon,
    description: "Guests have the whole place to themselves.",
  },
  {
    id: "room" as PropertyType,
    label: "A room",
    icon: DoorIcon,
    description:
      "Guests have their own room in a home, plus access to shared spaces.",
  },
  {
    id: "shared_room" as PropertyType,
    label: "A shared room in a hostel",
    icon: PeopleIcon,
    description:
      "Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.",
  },
];

export default function PropertyTypeStep({ data, onUpdate }: StepProps) {
  const handlePropertyTypeSelect = (propertyType: PropertyType) => {
    onUpdate({ propertyType });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>What type of place will guests have?</Text>

        <View style={styles.propertyContainer}>
          {PROPERTY_TYPES.map((property) => {
            const IconComponent = property.icon;
            const isSelected = data.propertyType === property.id;

            return (
              <TouchableOpacity
                key={property.id}
                style={[
                  styles.propertyCard,
                  isSelected && styles.propertyCardSelected,
                ]}
                onPress={() => handlePropertyTypeSelect(property.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.propertyLabel,
                        isSelected && styles.propertyLabelSelected,
                      ]}
                    >
                      {property.label}
                    </Text>
                    <Text
                      style={[
                        styles.propertyDescription,
                        isSelected && styles.propertyDescriptionSelected,
                      ]}
                    >
                      {property.description}
                    </Text>
                  </View>
                  <View style={styles.iconContainer}>
                    <IconComponent
                      size={32}
                      color={
                        isSelected ? colors.neutral[900] : colors.neutral[600]
                      }
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral[900],
    marginBottom: spacing.xl,
    fontWeight: "700",
  },
  propertyContainer: {
    gap: spacing.md,
  },
  propertyCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    ...shadows.sm,
  },
  propertyCardSelected: {
    borderColor: colors.neutral[900],
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  propertyLabel: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  propertyLabelSelected: {
    color: colors.neutral[900],
  },
  propertyDescription: {
    ...textStyles.body,
    color: colors.neutral[600],
    lineHeight: 20,
  },
  propertyDescriptionSelected: {
    color: colors.neutral[600],
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
