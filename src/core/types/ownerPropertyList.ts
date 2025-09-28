import { PropertyObject } from './propertyObjects';

// Owner Property List Types
export interface OwnerProperty extends PropertyObject {
  id: string;
  ownerId: string;
  status: 'draft' | 'published' | 'archived' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views?: number;
  inquiries?: number;
  bookings?: number;
}

export interface OwnerPropertyList {
  ownerId: string;
  properties: OwnerProperty[];
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  archivedProperties: number;
}

// Property status options
export const PROPERTY_STATUSES = [
  {
    id: 'draft' as const,
    label: 'Draft',
    description: 'Property is being created and not visible to renters',
    color: '#FF9800',
  },
  {
    id: 'published' as const,
    label: 'Published',
    description: 'Property is live and visible to renters',
    color: '#4CAF50',
  },
  {
    id: 'archived' as const,
    label: 'Archived',
    description: 'Property is hidden from renters',
    color: '#757575',
  },
  {
    id: 'sold' as const,
    label: 'Sold',
    description: 'Property has been sold',
    color: '#9C27B0',
  },
  {
    id: 'rented' as const,
    label: 'Rented',
    description: 'Property is currently rented',
    color: '#2196F3',
  },
];

// Default owner property
export const createDefaultOwnerProperty = (ownerId: string, propertyData: PropertyObject): OwnerProperty => {
  const now = new Date().toISOString();
  return {
    ...propertyData,
    id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ownerId,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    views: 0,
    inquiries: 0,
    bookings: 0,
  };
};

// Default owner property list
export const createDefaultOwnerPropertyList = (ownerId: string): OwnerPropertyList => ({
  ownerId,
  properties: [],
  totalProperties: 0,
  publishedProperties: 0,
  draftProperties: 0,
  archivedProperties: 0,
});

// Owner property utilities
export const getPropertyStatusLabel = (status: OwnerProperty['status']): string => {
  const found = PROPERTY_STATUSES.find(s => s.id === status);
  return found?.label || 'Unknown';
};

export const getPropertyStatusColor = (status: OwnerProperty['status']): string => {
  const found = PROPERTY_STATUSES.find(s => s.id === status);
  return found?.color || '#757575';
};

export const getPropertyStatusDescription = (status: OwnerProperty['status']): string => {
  const found = PROPERTY_STATUSES.find(s => s.id === status);
  return found?.description || '';
};

export const isPropertyPublished = (property: OwnerProperty): boolean => {
  return property.status === 'published';
};

export const isPropertyDraft = (property: OwnerProperty): boolean => {
  return property.status === 'draft';
};

export const isPropertyArchived = (property: OwnerProperty): boolean => {
  return property.status === 'archived';
};

export const canEditProperty = (property: OwnerProperty): boolean => {
  return ['draft', 'published'].includes(property.status);
};

export const canPublishProperty = (property: OwnerProperty): boolean => {
  return property.status === 'draft';
};

export const canArchiveProperty = (property: OwnerProperty): boolean => {
  return property.status === 'published';
};

export const canUnarchiveProperty = (property: OwnerProperty): boolean => {
  return property.status === 'archived';
};

// Property list utilities
export const getPropertiesByStatus = (properties: OwnerProperty[], status: OwnerProperty['status']): OwnerProperty[] => {
  return properties.filter(property => property.status === status);
};

export const getPublishedProperties = (properties: OwnerProperty[]): OwnerProperty[] => {
  return getPropertiesByStatus(properties, 'published');
};

export const getDraftProperties = (properties: OwnerProperty[]): OwnerProperty[] => {
  return getPropertiesByStatus(properties, 'draft');
};

export const getArchivedProperties = (properties: OwnerProperty[]): OwnerProperty[] => {
  return getPropertiesByStatus(properties, 'archived');
};

export const getPropertyById = (properties: OwnerProperty[], id: string): OwnerProperty | undefined => {
  return properties.find(property => property.id === id);
};

export const getPropertyStats = (properties: OwnerProperty[]): {
  total: number;
  published: number;
  draft: number;
  archived: number;
  sold: number;
  rented: number;
} => {
  return {
    total: properties.length,
    published: getPropertiesByStatus(properties, 'published').length,
    draft: getPropertiesByStatus(properties, 'draft').length,
    archived: getPropertiesByStatus(properties, 'archived').length,
    sold: getPropertiesByStatus(properties, 'sold').length,
    rented: getPropertiesByStatus(properties, 'rented').length,
  };
};

export const sortPropertiesByDate = (properties: OwnerProperty[], order: 'asc' | 'desc' = 'desc'): OwnerProperty[] => {
  return [...properties].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

export const sortPropertiesByStatus = (properties: OwnerProperty[]): OwnerProperty[] => {
  const statusOrder = ['published', 'draft', 'archived', 'sold', 'rented'];
  return [...properties].sort((a, b) => {
    const indexA = statusOrder.indexOf(a.status);
    const indexB = statusOrder.indexOf(b.status);
    return indexA - indexB;
  });
};

export const filterPropertiesBySearch = (properties: OwnerProperty[], searchTerm: string): OwnerProperty[] => {
  if (!searchTerm.trim()) return properties;
  
  const term = searchTerm.toLowerCase();
  return properties.filter(property => 
    property.street.toLowerCase().includes(term) ||
    property.area?.name.toLowerCase().includes(term) ||
    (property.propertyCategory && property.propertyCategory.toLowerCase().includes(term)) ||
    (property.propertyType && property.propertyType.toLowerCase().includes(term))
  );
};

// Property update utilities
export const updatePropertyStatus = (property: OwnerProperty, newStatus: OwnerProperty['status']): OwnerProperty => {
  const now = new Date().toISOString();
  return {
    ...property,
    status: newStatus,
    updatedAt: now,
    publishedAt: newStatus === 'published' ? now : property.publishedAt,
  };
};

export const incrementPropertyViews = (property: OwnerProperty): OwnerProperty => {
  return {
    ...property,
    views: (property.views || 0) + 1,
    updatedAt: new Date().toISOString(),
  };
};

export const incrementPropertyInquiries = (property: OwnerProperty): OwnerProperty => {
  return {
    ...property,
    inquiries: (property.inquiries || 0) + 1,
    updatedAt: new Date().toISOString(),
  };
};

export const incrementPropertyBookings = (property: OwnerProperty): OwnerProperty => {
  return {
    ...property,
    bookings: (property.bookings || 0) + 1,
    updatedAt: new Date().toISOString(),
  };
};
