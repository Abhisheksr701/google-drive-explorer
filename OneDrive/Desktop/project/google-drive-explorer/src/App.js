import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { authenticateGoogleDrive, listFiles } from './api/googleDrive';
import { classifyFiles } from './api/classifyFiles';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('googleDriveToken');
    if (token) {
      setIsAuthenticated(true);
      loadFiles();
    }
  }, []);

  const handleAuth = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Starting authentication...');
    
    try {
      await authenticateGoogleDrive();
      console.log('Authentication successful');
      setIsAuthenticated(true);
      loadFiles();
    } catch (error) {
      console.error('Authentication failed:', error);
      setError(`Authentication failed: ${error.message || error.error || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fileList = await listFiles();
      console.log('Files loaded:', fileList.length);
      const classifiedFiles = await classifyFiles(fileList);
      setFiles(classifiedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      setError(`Error loading files: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      loadFiles();
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fileList = await listFiles();
      const classifiedFiles = await classifyFiles(fileList);
      
      const filteredFiles = classifiedFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.author && file.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      setFiles(filteredFiles);
    } catch (error) {
      console.error('Error searching files:', error);
      setError(`Error searching files: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <div className="login-container">
          <h1>Google Drive File Explorer</h1>
          <p>Connect to your Google Drive to browse and search your files</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            onClick={handleAuth} 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Connecting...' : 'Connect Google Drive'}
          </button>
        </div>
      ) : (
        <Dashboard 
          files={files} 
          onSearch={handleSearch}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}

export default App;