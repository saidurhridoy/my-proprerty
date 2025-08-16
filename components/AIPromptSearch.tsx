import React from 'react';

interface AIPromptSearchProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  apiKeyAvailable: boolean;
}

const AIPromptSearch: React.FC<AIPromptSearchProps> = ({ prompt, onPromptChange, onSearch, isLoading, apiKeyAvailable }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent new line on Enter
        if (!isLoading && apiKeyAvailable) {
            onSearch();
        }
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-4">
        <label htmlFor="ai-prompt" className="block text-xl font-semibold text-slate-700 mb-3">
            Describe Your Ideal Rental
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
            <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 'a pet-friendly 2-bedroom apartment near a park with lots of natural light'"
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow resize-none"
            rows={2}
            disabled={!apiKeyAvailable}
            />
            <button
            onClick={onSearch}
            disabled={isLoading || !apiKeyAvailable}
            className="w-full sm:w-auto bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
            {isLoading ? 'Searching...' : 'Search with AI'}
            </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
            You can use this prompt box, the filters below, or both to find your perfect property. Press Enter to search.
        </p>
    </div>
  );
};

export default AIPromptSearch;
