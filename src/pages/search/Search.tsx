import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../features/api/api.ts';
import { SearchResultModel } from '../../shared/models/Search.ts';
import SearchResult from './SearchResult.tsx';
import { AxiosResponse } from 'axios';

interface SearchProps {
  visible: boolean;
  onClose: () => void;
}

const Search: React.FC<SearchProps> = ({ visible, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultModel[]>([]);
  const [filter, setFilter] = useState<'all' | 'user' | 'group'>('all');

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim() === '') {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const response: AxiosResponse<SearchResultModel[]> = await api.get(`/search/${query}`);
        const parserResponse: SearchResultModel[] = response.data.map(
          (searchResult: SearchResultModel): SearchResultModel =>
            searchResult.image.includes('uploads\\')
              ? { ...searchResult, image: `${api.defaults.baseURL}/${searchResult.image}` }
              : searchResult,
        );
        setResults(parserResponse);
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

  const handleResultClick = (result: SearchResultModel) => {
    console.log('Result clicked:', result);
  };

  const filteredResults = results.filter((result) => filter === 'all' || result.type === filter);

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
            {results.length > 0 && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 px-2 py-1 mx-1 rounded-full ${filter === 'all' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('user')}
                  className={`flex-1 px-2 py-1 mx-1 rounded-full ${filter === 'user' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                >
                  Users
                </button>
                <button
                  onClick={() => setFilter('group')}
                  className={`flex-1 px-2 py-1 mx-1 rounded-full ${filter === 'group' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                >
                  Groups
                </button>
              </div>
            )}
            {filteredResults.length > 0 ? (
              <div>
                {filteredResults.map((result, index) => (
                  <SearchResult
                    key={index}
                    result={result}
                    onClick={() => handleResultClick(result)}
                  />
                ))}
              </div>
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
