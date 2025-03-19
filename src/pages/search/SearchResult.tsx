import React from 'react';
import { UserIcon, UsersIcon } from '@heroicons/react/20/solid';
import { SearchResultProps } from "../../shared/models/Search.ts";

const SearchResult: React.FC<SearchResultProps> = ({ result, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center p-4 mb-4 bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors"
        >
            <img src={result.image} alt={result.name} className="h-12 w-12 rounded-full mr-4" />
            {result.type === 'user' ? (
                <UserIcon className="h-6 w-6 text-blue-500 mr-2" />
            ) : (
                <UsersIcon className="h-6 w-6 text-green-500 mr-2" />
            )}
            <span className="text-white">{result.name}</span>
        </div>
    );
};

export default SearchResult;