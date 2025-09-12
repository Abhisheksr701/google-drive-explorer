import { generateTags } from './geminiApi';

// Classify files by type and generate tags
export async function classifyFiles(files) {
  const classifiedFiles = [];
  
  for (const file of files) {
    try {
      // Determine file type based on MIME type
      const type = getFileType(file.mimeType);
      
      // Extract author information
      const author = file.owners && file.owners.length > 0 
        ? file.owners[0].displayName 
        : 'Unknown';
      
      // Generate tags based on file name and type
      const tags = await generateTags(file.name, type);
      
      classifiedFiles.push({
        id: file.id,
        name: file.name,
        type: type,
        author: author,
        size: file.size,
        modifiedTime: file.modifiedTime,
        createdTime: file.createdTime,
        webViewLink: file.webViewLink,
        tags: tags
      });
    } catch (error) {
      console.error(`Error classifying file ${file.name}:`, error);
      
      // Add file with basic info even if tagging fails
      classifiedFiles.push({
        id: file.id,
        name: file.name,
        type: getFileType(file.mimeType),
        author: file.owners && file.owners.length > 0 
          ? file.owners[0].displayName 
          : 'Unknown',
        size: file.size,
        modifiedTime: file.modifiedTime,
        createdTime: file.createdTime,
        webViewLink: file.webViewLink,
        tags: ['uncategorized']
      });
    }
  }
  
  return classifiedFiles;
}

// Determine file type based on MIME type
function getFileType(mimeType) {
  if (!mimeType) return 'documents';
  
  if (mimeType.includes('image/')) {
    return 'images';
  } else if (mimeType.includes('video/')) {
    return 'videos';
  } else if (
    mimeType.includes('application/pdf') ||
    mimeType.includes('text/') ||
    mimeType.includes('application/vnd.google-apps.document') ||
    mimeType.includes('application/msword') ||
    mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  ) {
    return 'documents';
  } else {
    return 'documents';
  }
}

// Group files by tags (for future enhancement)
export function groupFilesByTag(files) {
  const groupedFiles = {};
  
  files.forEach(file => {
    if (file.tags && file.tags.length > 0) {
      file.tags.forEach(tag => {
        if (!groupedFiles[tag]) {
          groupedFiles[tag] = [];
        }
        groupedFiles[tag].push(file);
      });
    }
  });
  
  return groupedFiles;
}