
import React from 'react';

interface HeaderProps {
  onOpenModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  return (
    <header className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Property Rental Finder</h1>
          <p className="text-sky-100 mt-1">Discover your next home with AI-powered insights</p>
        </div>
        <button
          onClick={onOpenModal}
          className="bg-white text-sky-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-sky-100 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          List Your Property
        </button>
      </div>
    </header>
  );
};

export default Header;