import {
  createDocument,
  getDocumentById,
  getDocumentsByUserId,
  updateDocument,
  deleteDocument
} from '../services/documentService.js';

/**
 * Create a new document
 * @route POST /api/documents
 * @access Private
 */
export const createNewDocument = async (req, res) => {
  try {
    const { title, subject, purpose, content, originalFileUrl, thumbnailUrl } = req.body;
    
    // Validate input
    if (!title || !subject || !purpose || !content) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }
    
    // Create document
    const document = await createDocument({
      userId: req.user.id,
      title,
      subject,
      purpose,
      content,
      originalFileUrl,
      thumbnailUrl
    });
    
    res.status(201).json(document);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

/**
 * Get all documents for the authenticated user
 * @route GET /api/documents
 * @access Private
 */
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await getDocumentsByUserId(req.user.id);
    
    res.json(documents);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

/**
 * Get document by ID
 * @route GET /api/documents/:id
 * @access Private
 */
export const getDocument = async (req, res) => {
  try {
    const document = await getDocumentById(req.params.id);
    
    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }
    
    // Check if document belongs to the authenticated user
    if (document.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this document');
    }
    
    res.json(document);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

/**
 * Update document
 * @route PUT /api/documents/:id
 * @access Private
 */
export const updateUserDocument = async (req, res) => {
  try {
    // Check if document exists and belongs to the user
    const document = await getDocumentById(req.params.id);
    
    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }
    
    if (document.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this document');
    }
    
    // Update document
    const updatedDocument = await updateDocument(req.params.id, req.body);
    
    res.json(updatedDocument);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};

/**
 * Delete document
 * @route DELETE /api/documents/:id
 * @access Private
 */
export const deleteUserDocument = async (req, res) => {
  try {
    // Check if document exists and belongs to the user
    const document = await getDocumentById(req.params.id);
    
    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }
    
    if (document.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this document');
    }
    
    // Delete document
    await deleteDocument(req.params.id);
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};