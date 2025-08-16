import React from 'react';
import PropertyTypeSelector from './PropertyTypeSelector';
import AmenitySelector from './AmenitySelector';
import LocationSelector from './LocationSelector';
import { PropertyType, SearchCriteria } from '../types';
import { SAFETY_AMENITIES, UTILITY_AMENITIES } from '../constants';

interface SearchFormProps {
  searchCriteria: SearchCriteria;
  onPropertyTypeSelect: (type: PropertyType | null) => void;
  onAmenityToggle: (amenityId: string, category: 'safety' | 'utility') => void;
  onLocationQueryChange: (query: string) => void;
  onPinLocationChange: (location: { lat: number; lng: number }) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
  apiKeyAvailable: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchCriteria,
  onPropertyTypeSelect,
  onAmenityToggle,
  onLocationQueryChange,
  onPinLocationChange,
  onSearch,
  onClear,
  isLoading,
  apiKeyAvailable,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-8">
      <PropertyTypeSelector
        selectedType={searchCriteria.propertyType}
        onSelect={onPropertyTypeSelect}
      />
      <AmenitySelector
        amenities={SAFETY_AMENITIES}
        selectedAmenities={searchCriteria.safetyAmenities}
        onToggle={(id) => onAmenityToggle(id, 'safety')}
        categoryTitle="Safety & Security"
      />
      <AmenitySelector
        amenities={UTILITY_AMENITIES}
        selectedAmenities={searchCriteria.utilityAmenities}
        onToggle={(id) => onAmenityToggle(id, 'utility')}
        categoryTitle="Utilities & Comfort"
      />
      <LocationSelector
        locationQuery={searchCriteria.locationQuery}
        pinnedLocation={searchCriteria.pinnedLocation}
        onLocationQueryChange={onLocationQueryChange}
        onPinLocationChange={onPinLocationChange}
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSearch}
          disabled={isLoading || !apiKeyAvailable}
          className="w-full sm:w-3/4 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? 'Searching...' : 'Find Properties'}
        </button>
        <button
          onClick={onClear}
          disabled={isLoading}
          className="w-full sm:w-1/4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchForm;