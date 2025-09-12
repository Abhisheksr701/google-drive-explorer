import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by file name or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          {searchTerm && (
            <button 
              type="button" 
              className="clear-button"
              onClick={handleClear}
              disabled={isLoading}
            >
              ×
            </button>
          )}
          <button 
            type="submit" 
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? '⏳' : '🔍'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;