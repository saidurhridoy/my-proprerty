import React from 'react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
}

const getSourceName = (url: string): string => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('agoda')) return 'Agoda.com';
    if (hostname.includes('airbnb')) return 'Airbnb.com';
    if (hostname.includes('booking')) return 'Booking.com';
    // Extract the main part of the domain as a fallback
    const parts = hostname.replace('www.', '').split('.');
    return parts.length > 1 ? `${parts[0].charAt(0).toUpperCase()}${parts[0].slice(1)}.com` : 'Original Listing';
  } catch (e) {
    return 'Original Listing';
  }
};


const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { title, address, rent, bedrooms, bathrooms, description, imageUrl, sourceUrl, isUserListing, contactNumber } = listing;

  const defaultImage = imageUrl || `https://picsum.photos/seed/${encodeURIComponent(title)}/400/300`;
  const sourceName = sourceUrl ? getSourceName(sourceUrl) : '';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col relative">
      {isUserListing && (
        <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-10">
          User Listing
        </div>
      )}
      <img 
        src={defaultImage} 
        alt={title} 
        className="w-full h-56 object-cover" 
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?grayscale'; }} // Fallback for broken picsum links
      />
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-semibold text-sky-700 mb-2">{title}</h4>
        {address && <p className="text-sm text-slate-600 mb-1">📍 {address}</p>}
        {rent && <p className="text-lg font-bold text-emerald-600 mb-2">{rent}</p>}
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
          {bedrooms && <span>🛏️ {bedrooms} Bedrooms</span>}
          {bathrooms && <span>🛁 {bathrooms} Bathrooms</span>}
          {contactNumber && <span>📞 {contactNumber}</span>}
        </div>
        
        <p className="text-slate-700 text-sm leading-relaxed mb-4 flex-grow">{description}</p>
        
        {sourceUrl && (
          <a 
            href={sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 hover:underline mt-auto font-semibold"
          >
            View on {sourceName}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default ListingCard;