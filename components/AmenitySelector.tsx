
import React from 'react';
import { Amenity } from '../types';

interface AmenitySelectorProps {
  amenities: Amenity[];
  selectedAmenities: string[];
  onToggle: (amenityId: string) => void;
  categoryTitle: string;
}

const AmenitySelector: React.FC<AmenitySelectorProps> = ({ amenities, selectedAmenities, onToggle, categoryTitle }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-slate-700 mb-3">{categoryTitle}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {amenities.map((amenity) => (
          <label
            key={amenity.id}
            className="flex items-center space-x-3 p-3 bg-white border border-slate-300 rounded-lg hover:bg-sky-50 cursor-pointer transition-colors duration-150"
          >
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity.id)}
              onChange={() => onToggle(amenity.id)}
              className="form-checkbox h-5 w-5 text-sky-600 rounded border-slate-400 focus:ring-sky-500"
            />
            <span className="text-slate-700">{amenity.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AmenitySelector;
    