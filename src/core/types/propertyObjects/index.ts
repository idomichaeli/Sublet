// Main property object exports
export { 
  PropertyObject,
  PropertyCategory,
  PropertyType,
  createDefaultPropertyObject,
  validatePropertyObject,
  getPropertyDisplayName,
  getPropertyAddress,
  getPropertySize,
  getPropertyPrice,
  getPropertyRooms
} from './PropertyObject';
export * from './PropertyCategoryObject';
export { 
  PropertyLocationObject,
  createDefaultPropertyLocationObject,
  validatePropertyLocation,
  getShelterLocationLabel,
  getShelterLocationDescription,
  getShelterDisplay,
  getNeighborhoodDisplay,
  getCoordinatesDisplay,
  PropertyLocationStepProps
} from './PropertyLocationObject';
export * from './PropertyBasicDetailsObject';
export * from './PropertyAmenitiesObject';
export * from './PropertyPhotosObject';
export * from './PropertyAvailabilityObject';
export * from './PropertyPricingObject';
export * from './PropertyReviewObject';
