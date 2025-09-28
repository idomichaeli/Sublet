import React from "react";
import GenericList from "../../../shared/components/ui/GenericList";
import PropertyOwnerCardGeneric from "./PropertyOwnerCardGeneric";

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

interface PropertyOwnerPropertiesListGenericProps {
  properties: Property[];
  expandedCards: Set<string>;
  onPropertyPress: (propertyId: string) => void;
  onEditProperty: (propertyId: string) => void;
  onViewRenters: (propertyId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  onToggleCardExpansion: (cardId: string) => void;
}

export default function PropertyOwnerPropertiesListGeneric({
  properties,
  expandedCards,
  onPropertyPress,
  onEditProperty,
  onViewRenters,
  onDeleteProperty,
  onToggleCardExpansion,
}: PropertyOwnerPropertiesListGenericProps) {
  const renderProperty = ({ item }: { item: Property }) => (
    <PropertyOwnerCardGeneric
      {...item}
      onPress={() => onPropertyPress(item.id)}
      onEditPress={() => onEditProperty(item.id)}
      onViewRentersPress={() => onViewRenters(item.id)}
    />
  );

  return (
    <GenericList
      data={properties}
      renderItem={renderProperty}
      keyExtractor={(item) => item.id}
      title="Your Properties"
      showCount={true}
      countLabel={`${properties.length} properties`}
      emptyStateIcon="🏠"
      emptyStateTitle="No Properties Yet"
      emptyStateSubtitle="Start by adding your first property to get started with managing your rentals."
      emptyStateActionLabel="Add Property"
      onEmptyStateActionPress={() => {
        // Navigate to add property screen
        console.log("Navigate to add property");
      }}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
    />
  );
}
