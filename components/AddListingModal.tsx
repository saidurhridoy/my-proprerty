
import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { Listing } from '../types';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: Omit<Listing, 'id' | 'isUserListing' | 'sourceUrl'>) => void;
}

const AddListingModal: React.FC<AddListingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const resetForm = () => {
    setTitle('');
    setAddress('');
    setRent('');
    setBedrooms('');
    setBathrooms('');
    setDescription('');
    setContactNumber('');
    setImageFile(null);
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setError('');
  };

  useEffect(() => {
    // Cleanup the object URL to avoid memory leaks when component unmounts
    return () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
    };
  }, [imagePreview]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !address || !contactNumber || !imageFile) {
      setError('Please fill out all mandatory fields: Title, Description, Address, Contact Number, and Property Picture.');
      return;
    }
    setError('');

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
        const imageUrlBase64 = reader.result as string;
        onSubmit({
            title,
            address,
            rent,
            bedrooms,
            bathrooms,
            description,
            imageUrl: imageUrlBase64,
            contactNumber,
        });

        resetForm();
        onClose();
    };
    reader.onerror = (error) => {
        setError('Failed to read image file. Please try another one.');
        console.error("FileReader error: ", error);
    }
  };
  
  const handleClose = () => {
      resetForm();
      onClose();
  }

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-listing-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 id="add-listing-title" className="text-2xl font-bold text-slate-800">List Your Property</h2>
            <button onClick={handleClose} className="text-slate-500 hover:text-slate-800" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title*</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" required />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description*</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" required></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address*</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" required />
              </div>
              <div>
                <label htmlFor="rent" className="block text-sm font-medium text-slate-700">Monthly Rent</label>
                <input type="text" id="rent" value={rent} onChange={(e) => setRent(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., $2500/month" />
              </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700">Bedrooms</label>
                <input type="text" id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 3 or Studio" />
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700">Bathrooms</label>
                <input type="text" id="bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 2.5" />
              </div>
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-slate-700">Contact Number*</label>
            <input type="tel" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" placeholder="+1-555-123-4567" required />
          </div>

          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-slate-700">Property Picture*</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Property preview" className="mx-auto h-48 w-auto rounded-md object-cover" />
                    ) : (
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                    <div className="flex text-sm text-slate-600 justify-center">
                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                            <span>Upload a file</span>
                            <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={handleClose} className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors">Submit Listing</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListingModal;