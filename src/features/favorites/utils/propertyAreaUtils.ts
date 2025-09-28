import { TEL_AVIV_LOCATIONS, TelAvivLocation } from "../../../shared/constants/locations";
import { SwipeCardData } from "../../swipe/components/SwipeCard";
import AreaStoryCard from "../components/PropertyAreaStoryCard";

export function getAreaStories(apartments: SwipeCardData[]) {
  return TEL_AVIV_LOCATIONS.map((locationName, index) => {
    const locationApartments = apartments.filter(apt => apt.location === locationName);
    return {
      location: {
        id: `area-${index}`,
        name: locationName,
        coordinates: { lat: 32.0853, lng: 34.7818 },
        areas: []
      },
      count: locationApartments.length,
      apartments: locationApartments,
    };
  }).filter(areaStory => areaStory.count > 0); // Only show areas with favorites
}

export function getAreaStoryCards(apartments: SwipeCardData[]) {
  return TelAvivLocation.areas.map((area) => ({
    id: area.id,
    name: area.name,
    city: area.city,
    apartments: area.apartments,
  }));
}