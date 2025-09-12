// Google Drive API service - Fixed version
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Load Google API scripts dynamically
function loadGoogleScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize Google APIs
export async function initGoogleApis() {
  try {
    // Load required scripts
    await loadGoogleScript('https://accounts.google.com/gsi/client');
    await loadGoogleScript('https://apis.google.com/js/api.js');
    
    // Load the gapi client
    await new Promise((resolve) => {
      window.gapi.load('client', resolve);
    });
    
    // Initialize the client
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    });
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Google APIs:', error);
    throw error;
  }
}

// Authenticate with Google Drive
export async function authenticateGoogleDrive() {
  try {
    await initGoogleApis();
    
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.accounts) {
        reject(new Error('Google authentication library not loaded'));
        return;
      }
      
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (response) => {
          if (response.error) {
            reject(response);
          } else {
            localStorage.setItem('googleDriveToken', response.access_token);
            resolve();
          }
        },
      });

      tokenClient.requestAccessToken();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// List files from Google Drive
export async function listFiles() {
  const token = localStorage.getItem('googleDriveToken');
  if (!token) {
    throw new Error('Not authenticated. Please connect to Google Drive first.');
  }

  try {
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?pageSize=100&fields=files(id,name,mimeType,size,createdTime,modifiedTime,owners,webViewLink)',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('googleDriveToken');
        throw new Error('Authentication expired. Please reconnect to Google Drive.');
      }
      throw new Error(`Failed to fetch files: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}