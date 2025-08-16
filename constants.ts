
import { PropertyType, Amenity } from './types';

export const PROPERTY_TYPES_OPTIONS: PropertyType[] = [
  PropertyType.BACHELOR,
  PropertyType.FAMILY,
  PropertyType.CORPORATE,
];

export const SAFETY_AMENITIES: Amenity[] = [
  { id: 'gated', name: 'Gated Community', category: 'safety' },
  { id: 'security_guard', name: '24/7 Security Guard', category: 'safety' },
  { id: 'cctv', name: 'CCTV Surveillance', category: 'safety' },
  { id: 'alarm', name: 'Alarm System', category: 'safety' },
  { id: 'intercom', name: 'Intercom System', category: 'safety' },
];

export const UTILITY_AMENITIES: Amenity[] = [
  { id: 'wifi', name: 'High-Speed Internet', category: 'utility' },
  { id: 'laundry', name: 'In-Unit Laundry', category: 'utility' },
  { id: 'parking', name: 'Dedicated Parking', category: 'utility' },
  { id: 'ac', name: 'Air Conditioning', category: 'utility' },
  { id: 'furnished', name: 'Furnished', category: 'utility' },
  { id: 'gym', name: 'Gym/Fitness Center Access', category: 'utility' },
  { id: 'pool', name: 'Swimming Pool Access', category: 'utility' },
  { id: 'lift', name: 'Lift/Elevator', category: 'utility' },
];

export const API_KEY_ERROR_MESSAGE = "API Key for Gemini is not configured. Please ensure the API_KEY environment variable is set.";
