import api from './api';

/**
 * Upload and process document
 * @param {FormData} formData - Form data with file and metadata
 * @returns {Promise} Promise with processed document
 */
export const uploadAndProcessDocument = async (formData) => {
  try {
    // Use different content type for file uploads
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // Add progress tracking
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // You can use this to update a progress bar
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload and process document');
  }
};