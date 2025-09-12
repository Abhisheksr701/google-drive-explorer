import React from 'react';
import '../styles/FileCard.css';

const FileCard = ({ file, viewMode }) => {
  const getFileIcon = () => {
    switch (file.type) {
      case 'documents':
        return '📄';
      case 'images':
        return '🖼️';
      case 'videos':
        return '🎬';
      default:
        return '📁';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  const handleFileClick = () => {
    window.open(`https://drive.google.com/file/d/${file.id}/view`, '_blank');
  };

  return (
    <div 
      className={`file-card ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}
      onClick={handleFileClick}
    >
      <div className="file-icon">{getFileIcon()}</div>
      
      <div className="file-info">
        <h3 className="file-name">{file.name}</h3>
        <p className="file-author">By: {file.author || 'Unknown author'}</p>
        
        {viewMode === 'list' && (
          <>
            <p className="file-size">{formatFileSize(file.size)}</p>
            <p className="file-date">Modified: {formatDate(file.modifiedTime)}</p>
          </>
        )}
        
        {file.tags && file.tags.length > 0 && (
          <div className="file-tags">
            {file.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
            {file.tags.length > 3 && <span className="tag-more">+{file.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileCard;