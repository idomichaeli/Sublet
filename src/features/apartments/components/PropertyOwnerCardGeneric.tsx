import React from "react";
import GenericCard from "../../../shared/components/ui/GenericCard";

export interface PropertyOwnerCardGenericProps {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  status: "available" | "booked" | "draft";
  views: number;
  interests: number;
  price?: number;
  rating?: number;
  nextBooking?: string;
  onPress?: () => void;
  onEditPress?: () => void;
  onViewRentersPress?: () => void;
  onDeletePress?: () => void;
  style?: any;
}

export default function PropertyOwnerCardGeneric({
  id,
  title,
  location,
  imageUrl,
  status,
  views,
  interests,
  price,
  rating,
  nextBooking,
  onPress,
  onEditPress,
  onViewRentersPress,
  onDeletePress,
  style,
}: PropertyOwnerCardGenericProps) {
  // Convert status to generic card format
  const getGenericStatus = () => {
    switch (status) {
      case "available":
        return "available";
      case "booked":
        return "unavailable";
      case "draft":
        return "pending";
      default:
        return "pending";
    }
  };

  // Create stats array for the generic card
  const stats = [
    {
      label: "Views",
      value: views,
      icon: "👁️",
    },
    {
      label: "Interests",
      value: interests,
      icon: "❤️",
    },
    {
      label: "Rating",
      value: rating ? `${rating}/5` : "N/A",
      icon: "⭐",
    },
  ];

  return (
    <GenericCard
      id={id}
      title={title}
      subtitle={location}
      imageUrl={imageUrl}
      status={getGenericStatus()}
      price={price}
      priceUnit="/month"
      rating={rating}
      stats={stats}
      onPress={onPress}
      onActionPress={onEditPress}
      onSecondaryActionPress={onViewRentersPress}
      actionLabel="Edit"
      secondaryActionLabel="View Renters"
      showStatus={true}
      showPrice={!!price}
      showRating={!!rating}
      showStats={true}
      showActions={!!(onEditPress || onViewRentersPress)}
      variant="detailed"
      style={style}
    />
  );
}
