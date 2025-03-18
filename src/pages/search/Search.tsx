import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../features/api/api.ts';

interface SearchProps {
  visible: boolean;
  onClose: () => void;
}

interface SearchResult {
  name: string;
  // Add other properties as needed
}

const Search: React.FC<SearchProps> = ({ visible, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim() === '') {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/search/${query}`);
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setLoading(true);
  };

  return (
    <motion.div
      initial={{ x: '70%', opacity: 0, visibility: 'hidden' }}
      animate={{ opacity: visible ? 1 : 0, visibility: visible ? 'visible' : 'hidden' }}
      transition={{ duration: 0.3 }}
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
          value={query}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded mb-4"
        />
        {loading ? (
          <div className="flex justify-center items-center mt-8">
            <div
              className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-300 rounded-full"
              role="status"
            ></div>
          </div>
        ) : (
          <div>
            {results.length > 0 ? (
              <ul>
                {results.map((result, index) => (
                  <li key={index} className="p-2 border-b border-gray-700">
                    {result.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No results found</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
