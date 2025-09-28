// Property Photos Object - Step 4
export interface PropertyPhotosObject {
  photos: string[];
}

// Photo upload constraints
export const PHOTO_CONSTRAINTS = {
  MAX_IMAGES: 15,
  MIN_IMAGES: 1,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Photo tips for users
export const PHOTO_TIPS = [
  "Take photos in good lighting",
  "Show different rooms and angles", 
  "Include outdoor spaces if available",
  "Keep rooms clean and tidy",
  "Take photos from different heights",
  "Show unique features of your property",
  "Include both wide shots and close-ups",
];

// Default property photos object
export const createDefaultPropertyPhotosObject = (): PropertyPhotosObject => ({
  photos: [],
});

// Property photos validation
export const validatePropertyPhotos = (photos: PropertyPhotosObject): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (photos.photos.length < PHOTO_CONSTRAINTS.MIN_IMAGES) {
    errors.push(`At least ${PHOTO_CONSTRAINTS.MIN_IMAGES} photo is required`);
  }

  if (photos.photos.length > PHOTO_CONSTRAINTS.MAX_IMAGES) {
    errors.push(`Maximum ${PHOTO_CONSTRAINTS.MAX_IMAGES} photos allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property photos utilities
export const getPhotoCount = (photos: PropertyPhotosObject): number => {
  return photos.photos.length;
};

export const getPhotoCountDisplay = (photos: PropertyPhotosObject): string => {
  const count = getPhotoCount(photos);
  return `${count} photo${count !== 1 ? "s" : ""} uploaded`;
};

export const hasPhotos = (photos: PropertyPhotosObject): boolean => {
  return photos.photos.length > 0;
};

export const canAddMorePhotos = (photos: PropertyPhotosObject): boolean => {
  return photos.photos.length < PHOTO_CONSTRAINTS.MAX_IMAGES;
};

export const getRemainingPhotoSlots = (photos: PropertyPhotosObject): number => {
  return Math.max(0, PHOTO_CONSTRAINTS.MAX_IMAGES - photos.photos.length);
};

export const addPhoto = (photos: PropertyPhotosObject, photoUri: string): PropertyPhotosObject => {
  if (canAddMorePhotos(photos)) {
    return {
      ...photos,
      photos: [...photos.photos, photoUri]
    };
  }
  return photos;
};

export const removePhoto = (photos: PropertyPhotosObject, photoUri: string): PropertyPhotosObject => {
  return {
    ...photos,
    photos: photos.photos.filter(uri => uri !== photoUri)
  };
};

export const removePhotoAtIndex = (photos: PropertyPhotosObject, index: number): PropertyPhotosObject => {
  if (index >= 0 && index < photos.photos.length) {
    const newPhotos = [...photos.photos];
    newPhotos.splice(index, 1);
    return {
      ...photos,
      photos: newPhotos
    };
  }
  return photos;
};

export const reorderPhotos = (photos: PropertyPhotosObject, fromIndex: number, toIndex: number): PropertyPhotosObject => {
  if (fromIndex >= 0 && fromIndex < photos.photos.length && 
      toIndex >= 0 && toIndex < photos.photos.length) {
    const newPhotos = [...photos.photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    return {
      ...photos,
      photos: newPhotos
    };
  }
  return photos;
};

export const setPhotos = (photos: PropertyPhotosObject, newPhotos: string[]): PropertyPhotosObject => {
  // Limit to max images
  const limitedPhotos = newPhotos.slice(0, PHOTO_CONSTRAINTS.MAX_IMAGES);
  
  return {
    ...photos,
    photos: limitedPhotos
  };
};

export const clearPhotos = (photos: PropertyPhotosObject): PropertyPhotosObject => {
  return {
    ...photos,
    photos: []
  };
};

export const getFirstPhoto = (photos: PropertyPhotosObject): string | undefined => {
  return photos.photos[0];
};

export const getLastPhoto = (photos: PropertyPhotosObject): string | undefined => {
  return photos.photos[photos.photos.length - 1];
};

export const getPhotoAtIndex = (photos: PropertyPhotosObject, index: number): string | undefined => {
  return photos.photos[index];
};

export const getPhotosAsArray = (photos: PropertyPhotosObject): string[] => {
  return [...photos.photos];
};

// Photo validation utilities
export const isValidPhotoFormat = (mimeType: string): boolean => {
  return PHOTO_CONSTRAINTS.ALLOWED_FORMATS.includes(mimeType);
};

export const isValidPhotoSize = (fileSize: number): boolean => {
  return fileSize <= PHOTO_CONSTRAINTS.MAX_FILE_SIZE;
};

export const validatePhotoFile = (file: { uri: string; type: string; size: number }): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidPhotoFormat(file.type)) {
    errors.push(`Invalid format. Allowed: ${PHOTO_CONSTRAINTS.ALLOWED_FORMATS.join(', ')}`);
  }

  if (!isValidPhotoSize(file.size)) {
    errors.push(`File too large. Maximum size: ${PHOTO_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property photos step props
export interface PropertyPhotosStepProps {
  data: PropertyPhotosObject;
  onUpdate: (updates: Partial<PropertyPhotosObject>) => void;
}
