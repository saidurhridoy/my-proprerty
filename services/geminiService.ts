import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SearchCriteria, Listing, GroundingChunk } from '../types';
import { SAFETY_AMENITIES, UTILITY_AMENITIES, API_KEY_ERROR_MESSAGE } from '../constants';

// Safely access process.env.API_KEY
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

if (!API_KEY) {
  console.error(API_KEY_ERROR_MESSAGE);
  // No throw here, App.tsx will handle displaying the error based on a check.
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const parseListingsFromString = (text: string): Listing[] => {
  const listings: Listing[] = [];
  // Normalize line endings before splitting
  const normalizedText = text.replace(/\r\n/g, '\n');
  const listingBlocks = normalizedText.split("START_LISTING").slice(1);

  listingBlocks.forEach((block, index) => {
    const listing: Partial<Listing> = { id: `listing-${Date.now()}-${index}` };
    const lines = block.split("END_LISTING")[0].trim().split('\n');
    
    lines.forEach(line => {
      // Use a more robust regex to split on the first colon, allowing for whitespace variations.
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        switch (key) {
          case 'TITLE': listing.title = value; break;
          case 'ADDRESS': listing.address = value; break;
          case 'RENT': listing.rent = value; break;
          case 'BEDROOMS': listing.bedrooms = value; break;
          case 'BATHROOMS': listing.bathrooms = value; break;
          case 'DESCRIPTION': listing.description = value; break;
          case 'IMAGE_URL': listing.imageUrl = value; break;
          case 'SOURCE_URL': listing.sourceUrl = value; break;
        }
      }
    });

    if (listing.title && listing.description) {
      listings.push(listing as Listing);
    }
  });
  return listings;
};


export const findListings = async (criteria: SearchCriteria): Promise<{ listings: Listing[], groundingChunks: GroundingChunk[], error?: string, warning?: string }> => {
  if (!ai) {
    return { listings: [], groundingChunks: [], error: API_KEY_ERROR_MESSAGE };
  }
  
  if (!criteria.pinnedLocation) {
    return { listings: [], groundingChunks: [], error: "Please select a location on the map." };
  }

  const safetyAmenityNames = criteria.safetyAmenities
    .map(id => SAFETY_AMENITIES.find(a => a.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  const utilityAmenityNames = criteria.utilityAmenities
    .map(id => UTILITY_AMENITIES.find(a => a.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  const userRequestSection = criteria.aiPrompt.trim()
    ? `The user has a specific request: "${criteria.aiPrompt}". This is the most important part of the search. Use it as your primary guide.`
    : `The user has not provided a specific text prompt. Infer their needs from the structured criteria below.`;

  const prompt = `
You are an expert real estate search assistant. Your task is to find and summarize real property rental listings from agoda.com, airbnb.com, and booking.com based on user-defined criteria.
Use Google Search to query these specific sites for relevant listings.

${userRequestSection}

Use the following details to find and filter relevant listings. If the user's prompt conflicts with these filters, prioritize the user's prompt.
- Location (Coordinates): Latitude ${criteria.pinnedLocation.lat}, Longitude ${criteria.pinnedLocation.lng}
- Location (Context): ${criteria.locationQuery || 'Not specified'}
- Property Type: ${criteria.propertyType || 'Any'}
- Safety/Security Amenities: ${safetyAmenityNames || 'Not specified'}
- Utility Amenities: ${utilityAmenityNames || 'Not specified'}

Find as many listings as you can, ideally between 9 and 12, that match the criteria from across agoda.com, airbnb.com, and booking.com. For each listing you find, provide a summary in the following strict format. Each field name must be exactly as written, followed by a colon and a space. Each listing must be enclosed by START_LISTING and END_LISTING. Do not use markdown formatting for the listing content.

START_LISTING
TITLE: [The title of the property from the source website]
ADDRESS: [The address or general location provided on the listing]
RENT: [The price per month or per night, as stated on the listing. Specify the period, e.g., $3000/month or $150/night]
BEDROOMS: [Number of bedrooms, e.g., 2 or Studio]
BATHROOMS: [Number of bathrooms, e.g., 1.5 or 2]
DESCRIPTION: [A concise summary (2-3 sentences) of the property's description from the source website, highlighting key features.]
IMAGE_URL: [A direct URL to an image of the property from the source website. If a direct URL is not available, use a placeholder like https://picsum.photos/seed/UNIQUE_SEED/400/300]
SOURCE_URL: [The direct URL to the original listing page on agoda.com, airbnb.com, or booking.com]
END_LISTING

Ensure that the SOURCE_URL for each listing is a valid link to its page on one of the three specified websites.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // No responseMimeType: "application/json" when using googleSearch tool
      },
    });

    const responseText = response.text;
    const listings = parseListingsFromString(responseText);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    if (listings.length === 0 && responseText.trim().length > 0) {
      // If parsing failed but we got some text, return it as a generic description with a warning.
      // This is a fallback if the model doesn't follow the format perfectly.
      console.warn("Gemini response did not strictly follow the expected START_LISTING/END_LISTING format. Raw response:", responseText);
      const fallbackListing: Listing = {
        id: `fallback-${Date.now()}`,
        title: "AI Generated Response (Format Mismatch)",
        description: "The AI model provided information, but it wasn't in the structured format expected. Displaying the raw text it returned:\n\n" + responseText,
        imageUrl: "https://picsum.photos/seed/fallback/400/300"
      };
      return { 
          listings: [fallbackListing], 
          groundingChunks, 
          warning: "The AI's response couldn't be fully structured, so the raw text is shown below. Some details might be missing." 
      };
    }

    return { listings, groundingChunks };

  } catch (error: any) {
    console.error("Error fetching listings from Gemini API:", error);
    let errorMessage = "Failed to fetch listings. Please try again later.";
    if (error.message && error.message.includes('API key not valid')) {
        errorMessage = API_KEY_ERROR_MESSAGE + " Or, the key might be invalid.";
    } else if (error.message) {
        errorMessage = `API Error: ${error.message}`;
    }
    return { listings: [], groundingChunks: [], error: errorMessage };
  }
};

export const isApiKeyConfigured = (): boolean => {
  return !!API_KEY;
};