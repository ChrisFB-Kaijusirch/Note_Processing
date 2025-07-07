import { uploadFileToS3, extractTextFromDocument } from '../services/textractService.js';
import { processTextWithAI } from '../utils/aiProcessor.js';
import { createDocument } from '../services/documentService.js';
import { s3, bucketName } from '../config/awsConfig.js';

/**
 * Upload and process document
 * @route POST /api/upload
 * @access Private
 */
export const uploadAndProcessDocument = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }
    
    // Get form data
    const { subject, purpose, action } = req.body;
    
    // Validate input
    if (!subject || !purpose || !action) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }
    
    // Upload file to S3
    const s3ObjectKey = await uploadFileToS3(req.file);
    
    // Generate S3 URLs
    const originalFileUrl = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: s3ObjectKey,
      Expires: 60 * 60 * 24 * 7 // 7 days
    });
    
    // Extract text from document using Textract
    const extractedText = await extractTextFromDocument(s3ObjectKey);
    
    // Process text with AI
    const processedContent = await processTextWithAI(extractedText, {
      subject,
      purpose,
      action
    });
    
    // Generate title based on subject and purpose
    const purposeLabels = {
      'knowledge-library': 'Knowledge Library',
      'sop': 'SOP',
      'training-manual': 'Training Manual',
      'policy-document': 'Policy',
      'other': 'Document'
    };
    
    const title = `${subject} ${purposeLabels[purpose] || 'Document'}`;
    
    // Create document in database
    const document = await createDocument({
      userId: req.user.id,
      title,
      subject,
      purpose,
      content: processedContent,
      originalFileUrl,
      thumbnailUrl: null // In a real app, we would generate a thumbnail
    });
    
    res.status(201).json({
      message: 'Document processed successfully',
      document
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
};