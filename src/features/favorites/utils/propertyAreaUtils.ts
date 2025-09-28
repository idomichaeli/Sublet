import { TEL_AVIV_LOCATIONS, TelAvivLocation } from "../../../shared/constants/locations";
import { SwipeCardData } from "../../swipe/components/SwipeCard";
import AreaStoryCard from "../components/PropertyAreaStoryCard";

export function getAreaStories(apartments: SwipeCardData[]) {
  return TEL_AVIV_LOCATIONS.map((loc, index) => ({
    location: TelAvivLocation,
    count: Math.floor(Math.random() * 20) + 5,
    apartments: apartments.filter(apt => apt.location === loc),
  }));
}

export function getAreaStoryCards(apartments: SwipeCardData[]) {
  return TelAvivLocation.areas.map((area) => ({
    id: area.id,
    name: area.name,
    city: area.city,
    apartments: area.apartments,
  }));
}