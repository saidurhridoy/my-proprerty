
export enum PropertyType {
  BACHELOR = 'Bachelor Pad',
  FAMILY = 'Family Home',
  CORPORATE = 'Corporate Housing',
}

export interface Amenity {
  id: string;
  name:string;
  category: 'safety' | 'utility';
}

export interface Listing {
  id: string;
  title: string;
  address?: string;
  rent?: string;
  bedrooms?: string; // Keep as string for flexibility from Gemini
  bathrooms?: string; // Keep as string for flexibility from Gemini
  description: string;
  imageUrl?: string;
  sourceUrl?: string; // For individual listing, if Gemini can provide
  isUserListing?: boolean;
  contactNumber?: string;
}

export interface SearchCriteria {
  propertyType: PropertyType | null;
  safetyAmenities: string[]; // Array of amenity IDs
  utilityAmenities: string[]; // Array of amenity IDs
  location: string;
}

// Types for Gemini grounding metadata
export interface WebGroundingChunk {
  uri?: string; // Made optional to match GoogleGenAI.GroundingChunkWeb
  title?: string; // Made optional for robustness, matches GoogleGenAI.GroundingChunkWeb
}

export interface GroundingChunk {
  web?: WebGroundingChunk;
  // Other types of grounding chunks can be added here if needed
}