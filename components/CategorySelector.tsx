
import React from 'react';

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
}

const categories = [
  'Science',
  'History',
  'Movies',
  'Music',
  'Video Games',
  'Geography',
  'Sports',
  'General Knowledge',
];

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectCategory }) => {
  return (
    <div className="text-center p-4 animate-fade-in">
      <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-orbitron mb-8 text-center">
        Trivium
      </h1>
      <p className="text-lg text-gray-300 mb-10">Select a category to begin your challenge!</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className="p-4 bg-gray-800 rounded-lg text-lg font-semibold text-white border-2 border-gray-700
                       hover:bg-cyan-500 hover:text-gray-900 hover:border-cyan-400 transform hover:scale-105 transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
