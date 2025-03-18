import React from 'react';
import { motion } from 'framer-motion';

interface SearchProps {
  visible: boolean;
  onClose: () => void;
}

const Search: React.FC<SearchProps> = ({ visible, onClose }) => {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: visible ? '70%' : '-100%' }}
      transition={{ duration: 0.5 }}
      className="fixed inset-y-0 left-0 w-80 bg-gray-900 text-white shadow-lg z-40"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Search</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            &times;
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded mb-4"
        />
        {/* Add search results here */}
      </div>
    </motion.div>
  );
};

export default Search;
