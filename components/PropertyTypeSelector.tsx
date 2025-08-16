
import React from 'react';
import { PropertyType } from '../types';
import { PROPERTY_TYPES_OPTIONS } from '../constants';

interface PropertyTypeSelectorProps {
  selectedType: PropertyType | null;
  onSelect: (type: PropertyType) => void;
}

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-slate-700 mb-3">Property Type</h3>
      <div className="flex flex-wrap gap-3">
        {PROPERTY_TYPES_OPTIONS.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105
              ${selectedType === type 
                ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300' 
                : 'bg-white text-slate-700 hover:bg-sky-100 border border-slate-300'
              }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyTypeSelector;
    