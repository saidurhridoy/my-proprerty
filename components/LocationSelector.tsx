
import React from 'react';

interface LocationSelectorProps {
  location: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ location, onLocationChange }) => {
  const mapUrl = location 
    ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}&embed=1`
    : `https://www.openstreetmap.org/export/embed.html?bbox=-122.53,37.68,-122.34,37.83&layer=mapnik&marker=37.75,-122.44`; // Default to San Francisco area

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-slate-700 mb-3">Location</h3>
      <input
        type="text"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder="Enter city, neighborhood, or zip code (e.g., San Francisco, CA)"
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
      />
      <div className="mt-4 h-64 w-full rounded-lg overflow-hidden border border-slate-300 shadow-sm">
        {location ? (
             <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed&z=12`}
                title="Location Map"
                loading="lazy"
             ></iframe>
        ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                <p>Enter a location to see it on the map.</p>
            </div>
        )}
      </div>
       <p className="text-xs text-slate-500 mt-1">Map is for illustrative purposes. Search uses the text input.</p>
    </div>
  );
};

export default LocationSelector;
    