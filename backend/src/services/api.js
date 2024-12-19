const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://paromeosi-backend.onrender.com/api'
  : 'http://localhost:5001/api';

export const getPhotos = async () => {
  try {
    const response = await fetch(`${API_URL}/photos`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

export const getPhotosByTag = async (tag) => {
  try {
    const response = await fetch(`${API_URL}/photos/tag/${tag}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching photos by tag:', error);
    throw error;
  }
};

export const getTags = async () => {
  try {
    const response = await fetch(`${API_URL}/photos/tags`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const submitPhoto = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/email/submit`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting photo:', error);
    throw error;
  }
};