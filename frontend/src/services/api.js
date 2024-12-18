const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://paromeosi-backend.onrender.com/api'
  : 'http://localhost:5001/api';

export const getPhotos = async () => {
  try {
    const response = await fetch(`${API_URL}/photos`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

export const getPhotosByTag = async (tag) => {
  try {
    const response = await fetch(`${API_URL}/photos/tag/${tag}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching photos by tag:', error);
    throw error;
  }
};

export const getTags = async () => {
  try {
    const response = await fetch(`${API_URL}/photos/tags`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const deletePhoto = async (photoId) => {
  try {
    const response = await fetch(`${API_URL}/photos/${photoId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

export const adminUploadPhoto = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/admin/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};