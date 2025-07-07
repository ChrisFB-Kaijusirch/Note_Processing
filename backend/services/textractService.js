import { textract, s3, bucketName } from '../config/awsConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upload file to S3
 * @param {object} file - File object from multer
 * @returns {string} S3 object key
 */
export const uploadFileToS3 = async (file) => {
  const fileContent = fs.readFileSync(file.path);
  
  const params = {
    Bucket: bucketName,
    Key: `uploads/${Date.now()}-${file.originalname}`,
    Body: fileContent,
    ContentType: file.mimetype
  };
  
  const result = await s3.upload(params).promise();
  
  // Delete local file after upload
  fs.unlinkSync(file.path);
  
  return result.Key;
};

/**
 * Extract text from document using Amazon Textract
 * @param {string} s3ObjectKey - S3 object key
 * @returns {string} Extracted text
 */
export const extractTextFromDocument = async (s3ObjectKey) => {
  // Check if file is PDF or image
  const fileExtension = path.extname(s3ObjectKey).toLowerCase();
  
  let textractParams;
  
  if (fileExtension === '.pdf') {
    // For PDF files, use document analysis
    textractParams = {
      Document: {
        S3Object: {
          Bucket: bucketName,
          Name: s3ObjectKey
        }
      },
      FeatureTypes: ['TABLES', 'FORMS']
    };
    
    const result = await textract.analyzeDocument(textractParams).promise();
    return extractTextFromBlocks(result.Blocks);
  } else {
    // For images, use text detection
    textractParams = {
      Document: {
        S3Object: {
          Bucket: bucketName,
          Name: s3ObjectKey
        }
      }
    };
    
    const result = await textract.detectDocumentText(textractParams).promise();
    return extractTextFromBlocks(result.Blocks);
  }
};

/**
 * Extract text from Textract blocks
 * @param {Array} blocks - Textract blocks
 * @returns {string} Extracted text
 */
const extractTextFromBlocks = (blocks) => {
  let text = '';
  
  // Filter for LINE blocks and extract text
  const lineBlocks = blocks.filter(block => block.BlockType === 'LINE');
  
  lineBlocks.forEach(block => {
    text += block.Text + '\\n';
  });
  
  return text;
};