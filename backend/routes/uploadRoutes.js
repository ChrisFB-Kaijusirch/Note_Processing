import express from 'express';
import { uploadAndProcessDocument } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Upload and process document
router.post('/', upload.single('file'), uploadAndProcessDocument);

export default router;