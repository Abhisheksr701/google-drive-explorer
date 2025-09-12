import React, { useState } from 'react';
import SearchBar from './SearchBar';
import FileGrid from './FileGrid';
import '../styles/Dashboard.css';

const Dashboard = ({ files, onSearch, isLoading }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredFiles = filterType === 'all' 
    ? files 
    : files.filter(file => file.type === filterType);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Google Drive File Explorer</h1>
        <div className="view-controls">
          <button 
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
      </header>

      <SearchBar onSearch={onSearch} isLoading={isLoading} />

      <div className="filter-controls">
        <button 
          className={filterType === 'all' ? 'active' : ''}
          onClick={() => handleFilterChange('all')}
        >
          All Files
        </button>
        <button 
          className={filterType === 'documents' ? 'active' : ''}
          onClick={() => handleFilterChange('documents')}
        >
          Documents
        </button>
        <button 
          className={filterType === 'images' ? 'active' : ''}
          onClick={() => handleFilterChange('images')}
        >
          Images
        </button>
        <button 
          className={filterType === 'videos' ? 'active' : ''}
          onClick={() => handleFilterChange('videos')}
        >
          Videos
        </button>
      </div>

      <div className="dashboard-content">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading files...</p>
          </div>
        ) : (
          <>
            <div className="file-count">
              Showing {filteredFiles.length} of {files.length} files
            </div>
            <FileGrid files={filteredFiles} viewMode={viewMode} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;