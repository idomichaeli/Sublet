import { TEL_AVIV_LOCATIONS, TelAvivLocation } from "../../../shared/constants/locations";
import { SwipeCardData } from "../../swipe/components/SwipeCard";
import { AreaStory } from "../components/AreaStoryCard";

export const getAreaStories = (favorites: SwipeCardData[]): AreaStory[] => {
  const areaMap = new Map<string, AreaStory>();

  favorites.forEach((apartment) => {
    const locationName = apartment.location;
    const telAvivLocation = TEL_AVIV_LOCATIONS.find(
      (loc) => loc.name === locationName
    );

    if (telAvivLocation) {
      const existing = areaMap.get(telAvivLocation.id);
      if (existing) {
        existing.count += 1;
        existing.apartments.push(apartment);
      } else {
        areaMap.set(telAvivLocation.id, {
          location: telAvivLocation,
          count: 1,
          apartments: [apartment],
        });
      }
    }
  });

  return Array.from(areaMap.values()).sort((a, b) => b.count - a.count);
};
