import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ListingsDisplay from './components/ListingsDisplay';
import AddListingModal from './components/AddListingModal';
import AIPromptSearch from './components/AIPromptSearch';
import { PropertyType, SearchCriteria, Listing, GroundingChunk } from './types';
import { API_KEY_ERROR_MESSAGE } from './constants';
import { findListings, isApiKeyConfigured } from './services/geminiService';

const defaultSearchCriteria: SearchCriteria = {
  propertyType: null,
  safetyAmenities: [],
  utilityAmenities: [],
  locationQuery: 'New York, NY',
  pinnedLocation: { lat: 40.7128, lng: -74.0060 }, // Default to NYC coordinates
  aiPrompt: '',
};

const USER_LISTINGS_STORAGE_KEY = 'userPropertyListings';


const App: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(defaultSearchCriteria);
  const [listings, setListings] = useState<Listing[]>([]);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [sourceAttributions, setSourceAttributions] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load user listings from localStorage on initial render
  useEffect(() => {
    try {
      const storedListings = localStorage.getItem(USER_LISTINGS_STORAGE_KEY);
      if (storedListings) {
        setUserListings(JSON.parse(storedListings));
      }
    } catch (e) {
      console.error("Failed to parse user listings from localStorage", e);
    }
  }, []);

  // Save user listings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(USER_LISTINGS_STORAGE_KEY, JSON.stringify(userListings));
    } catch (e) {
      console.error("Failed to save user listings to localStorage", e);
    }
  }, [userListings]);

  useEffect(() => {
    if (!isApiKeyConfigured()) {
      setError(API_KEY_ERROR_MESSAGE);
      setApiKeyAvailable(false);
    }
  }, []);

  const handlePropertyTypeSelect = useCallback((type: PropertyType | null) => {
    setSearchCriteria(prev => ({ ...prev, propertyType: type }));
  }, []);

  const handleAmenityToggle = useCallback((amenityId: string, category: 'safety' | 'utility') => {
    setSearchCriteria(prev => {
      const currentAmenities = category === 'safety' ? prev.safetyAmenities : prev.utilityAmenities;
      const newAmenities = currentAmenities.includes(amenityId)
        ? currentAmenities.filter(id => id !== amenityId)
        : [...currentAmenities, amenityId];
      return category === 'safety'
        ? { ...prev, safetyAmenities: newAmenities }
        : { ...prev, utilityAmenities: newAmenities };
    });
  }, []);

  const handleLocationQueryChange = useCallback((query: string) => {
    setSearchCriteria(prev => ({ ...prev, locationQuery: query }));
  }, []);

  const handlePinLocationChange = useCallback((location: { lat: number; lng: number }) => {
    setSearchCriteria(prev => ({ ...prev, pinnedLocation: location }));
  }, []);
  
  const handleAiPromptChange = useCallback((prompt: string) => {
      setSearchCriteria(prev => ({...prev, aiPrompt: prompt}));
  }, []);

  const handleClear = useCallback(() => {
    setSearchCriteria(defaultSearchCriteria);
    setListings([]);
    setError(null);
    setWarning(null);
    setSourceAttributions([]);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!apiKeyAvailable) {
      setError(API_KEY_ERROR_MESSAGE);
      return;
    }
    if (!searchCriteria.pinnedLocation) {
      setError("Please select a location on the map to search for properties.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setWarning(null);
    setListings([]);
    setSourceAttributions([]);

    const result = await findListings(searchCriteria);
    
    if (result.error) {
      setError(result.error);
      setListings([]);
    } else {
      setListings(result.listings);
      setSourceAttributions(result.groundingChunks);
      if(result.warning) {
          setWarning(result.warning);
      }
    }
    setIsLoading(false);
  }, [apiKeyAvailable, searchCriteria]);
  
  // Perform an initial search on load with default criteria if API key is present
  useEffect(() => {
    if (apiKeyAvailable) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleSearch(); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyAvailable]); // Only run once when apiKeyAvailable status is determined

  const handleAddNewListing = useCallback((newListingData: Omit<Listing, 'id' | 'isUserListing' | 'sourceUrl'>) => {
      const newListing: Listing = {
        ...newListingData,
        id: `user-${Date.now()}`,
        isUserListing: true,
      };
      setUserListings(prev => [newListing, ...prev]);
  }, []);

  const allListings = [...userListings, ...listings];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <AIPromptSearch 
            prompt={searchCriteria.aiPrompt}
            onPromptChange={handleAiPromptChange}
            onSearch={handleSearch}
            isLoading={isLoading}
            apiKeyAvailable={apiKeyAvailable}
        />
        <div className="mt-8">
            <SearchForm
            searchCriteria={searchCriteria}
            onPropertyTypeSelect={handlePropertyTypeSelect}
            onAmenityToggle={handleAmenityToggle}
            onLocationQueryChange={handleLocationQueryChange}
            onPinLocationChange={handlePinLocationChange}
            onSearch={handleSearch}
            onClear={handleClear}
            isLoading={isLoading}
            apiKeyAvailable={apiKeyAvailable}
            />
        </div>
        <ListingsDisplay 
            listings={allListings} 
            sourceAttributions={sourceAttributions} 
            isLoading={isLoading} 
            error={error} 
            warning={warning} 
        />
      </main>
      <AddListingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNewListing}
      />
      <footer className="bg-slate-800 text-slate-300 text-center p-4 mt-auto">
        <p>Powered by My Property.</p>
      </footer>
    </div>
  );
};

export default App;