import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

// Fix for default icon issue with webpack/bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationSelectorProps {
  locationQuery: string;
  pinnedLocation: { lat: number; lng: number } | null;
  onLocationQueryChange: (query: string) => void;
  onPinLocationChange: (location: { lat: number; lng: number }) => void;
}

interface ChangeViewProps {
  center: LatLngExpression;
  zoom: number;
}

const ChangeView: React.FC<ChangeViewProps> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const DraggableMarker = ({ position, setPosition }: { position: {lat: number, lng: number}, setPosition: (pos: {lat: number, lng: number}) => void }) => {
    const markerRef = useRef<L.Marker>(null);

    const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition({ lat, lng });
        }
      },
    }),
    [setPosition],
    );

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    )
}


const LocationSelector: React.FC<LocationSelectorProps> = ({
  locationQuery,
  pinnedLocation,
  onLocationQueryChange,
  onPinLocationChange,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to New York City
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (pinnedLocation) {
        setMapCenter([pinnedLocation.lat, pinnedLocation.lng]);
    }
  }, []); // Run only once on mount to set initial map center from props

  const handleGeocodeSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!locationQuery.trim()) return;

    setIsGeocoding(true);
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const newLat = parseFloat(lat);
            const newLng = parseFloat(lon);
            setMapCenter([newLat, newLng]);
            onPinLocationChange({ lat: newLat, lng: newLng });
        } else {
            alert('Location not found. Please try a different search term.');
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        alert('Failed to search for location. Please check your connection and try again.');
    } finally {
        setIsGeocoding(false);
    }
  };


  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-slate-700 mb-3">Location</h3>
      <form onSubmit={handleGeocodeSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={locationQuery}
          onChange={(e) => onLocationQueryChange(e.target.value)}
          placeholder="Enter a city or address to center the map"
          className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
        />
        <button
            type="submit"
            disabled={isGeocoding}
            className="bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
            {isGeocoding ? 'Finding...' : 'Find on Map'}
        </button>
      </form>
      
      <div className="h-96 w-full rounded-lg overflow-hidden border border-slate-300 shadow-sm z-0">
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <ChangeView center={mapCenter} zoom={13} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pinnedLocation && (
             <DraggableMarker position={pinnedLocation} setPosition={onPinLocationChange} />
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 mt-1">Drag the pin to refine your search location. The property search will be based on the pin's final position.</p>
    </div>
  );
};

export default LocationSelector;