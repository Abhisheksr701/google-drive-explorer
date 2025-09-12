import React from 'react';
import FileCard from './FileCard';
import '../styles/FileGrid.css';

const FileGrid = ({ files, viewMode }) => {
  if (files.length === 0) {
    return (
      <div className="no-files">
        <p>No files found. Try a different search or filter.</p>
      </div>
    );
  }

  return (
    <div className={`file-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
      {files.map(file => (
        <FileCard key={file.id} file={file} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default FileGrid;