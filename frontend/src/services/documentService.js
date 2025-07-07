import api from './api';

/**
 * Get all documents for the authenticated user
 * @returns {Promise} Promise with documents data
 */
export const getUserDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {Promise} Promise with document data
 */
export const getDocumentById = async (id) => {
  try {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch document');
  }
};

/**
 * Create a new document
 * @param {object} documentData - Document data
 * @returns {Promise} Promise with created document
 */
export const createDocument = async (documentData) => {
  try {
    const response = await api.post('/documents', documentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create document');
  }
};

/**
 * Update document
 * @param {string} id - Document ID
 * @param {object} updateData - Data to update
 * @returns {Promise} Promise with updated document
 */
export const updateDocument = async (id, updateData) => {
  try {
    const response = await api.put(`/documents/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update document');
  }
};

/**
 * Delete document
 * @param {string} id - Document ID
 * @returns {Promise} Promise with success message
 */
export const deleteDocument = async (id) => {
  try {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete document');
  }
};