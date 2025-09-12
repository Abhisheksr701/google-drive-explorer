// Gemini AI API service for generating tags
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Generate tags for a file based on its name and type
export async function generateTags(filename, fileType) {
  if (!API_KEY) {
    console.warn('Gemini API key not found. Using fallback tagging.');
    return fallbackTagging(filename, fileType);
  }

  try {
    const prompt = `Generate 3-5 relevant tags for a file with name "${filename}" and type "${fileType}". 
    Return only a JSON array of tags, without any additional text or explanation.`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to parse the response as JSON
    try {
      const tags = JSON.parse(textResponse);
      if (Array.isArray(tags)) {
        return tags.slice(0, 5); // Return up to 5 tags
      }
    } catch (e) {
      // If parsing fails, try to extract tags from plain text
      return extractTagsFromText(textResponse);
    }
    
    return fallbackTagging(filename, fileType);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return fallbackTagging(filename, fileType);
  }
}

// Fallback tagging if Gemini API is not available
function fallbackTagging(filename, fileType) {
  const tags = [];
  
  // Add file type as a tag
  tags.push(fileType);
  
  // Extract potential tags from filename
  const words = filename.split(/[\s._-]/);
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (cleanWord.length > 3 && !tags.includes(cleanWord)) {
      tags.push(cleanWord);
    }
  });
  
  // Limit to 5 tags
  return tags.slice(0, 5);
}

// Extract tags from text response
function extractTagsFromText(text) {
  // Try to find a JSON array in the text
  const jsonMatch = text.match(/\[[^\]]*\]/);
  if (jsonMatch) {
    try {
      const tags = JSON.parse(jsonMatch[0]);
      if (Array.isArray(tags)) {
        return tags.slice(0, 5);
      }
    } catch (e) {
      // If parsing fails, continue with other methods
    }
  }
  
  // Extract words that might be tags
  const words = text.split(/,|\n|\.|;/).map(word => 
    word.replace(/["'\[\]]/g, '').trim().toLowerCase()
  ).filter(word => 
    word.length > 2 && !['and', 'the', 'for', 'with', 'from'].includes(word)
  );
  
  return Array.from(new Set(words)).slice(0, 5);
}