import React from 'react';
import { Listing, GroundingChunk } from '../types';
import ListingCard from './ListingCard';

interface ListingsDisplayProps {
  listings: Listing[];
  sourceAttributions: GroundingChunk[];
  isLoading: boolean;
  error: string | null;
}

const ListingsDisplay: React.FC<ListingsDisplayProps> = ({ listings, sourceAttributions, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-600"></div>
        <span className="ml-4 text-slate-600">Searching for properties...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg shadow">{error}</div>;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-lg">
        <div className="flex justify-center items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-700">No Listings Found</h3>
        <p className="text-slate-500 mt-2">Try adjusting your search criteria to find available properties.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default ListingsDisplay;