import express from 'express';
import {
  createNewDocument,
  getUserDocuments,
  getDocument,
  updateUserDocument,
  deleteUserDocument
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all documents for the authenticated user
router.get('/', getUserDocuments);

// Create a new document
router.post('/', createNewDocument);

// Get document by ID
router.get('/:id', getDocument);

// Update document
router.put('/:id', updateUserDocument);

// Delete document
router.delete('/:id', deleteUserDocument);

export default router;