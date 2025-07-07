import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Process text with AI model to generate structured document
 * @param {string} text - Extracted text from the document
 * @param {object} options - Processing options
 * @returns {string} Processed text
 */
export const processTextWithAI = async (text, options) => {
  try {
    const { subject, purpose, action } = options;
    
    // Create prompt based on the purpose and action
    let prompt = `You are an expert document creator. I have some handwritten notes that have been converted to text. 
    The subject is: ${subject}. 
    I need you to create a ${getPurposeLabel(purpose)} document.
    Specifically, I need you to ${getActionDescription(action)}.
    
    Here is the extracted text:
    ${text}
    
    Please format the output in Markdown.`;
    
    // Call AI model API
    const response = await axios.post(process.env.AI_MODEL_ENDPOINT, {
      model: process.env.AI_MODEL_NAME,
      prompt: prompt,
      stream: false,
      max_tokens: 2000
    });
    
    // Return the processed text
    return response.data.response;
  } catch (error) {
    console.error('Error processing text with AI:', error);
    throw new Error('Failed to process text with AI model');
  }
};

/**
 * Get human-readable purpose label
 * @param {string} purpose - Purpose code
 * @returns {string} Purpose label
 */
const getPurposeLabel = (purpose) => {
  const purposeMap = {
    'knowledge-library': 'Knowledge Library Article',
    'sop': 'Standard Operating Procedure (SOP)',
    'training-manual': 'Training Manual',
    'policy-document': 'Policy Document',
    'other': 'Custom Document'
  };
  
  return purposeMap[purpose] || 'Document';
};

/**
 * Get action description for AI prompt
 * @param {string} action - Action code
 * @returns {string} Action description
 */
const getActionDescription = (action) => {
  const actionMap = {
    'create-document': 'analyze the text and create a well-structured document',
    'summarize': 'summarize the content into a concise document',
    'step-by-step': 'create step-by-step instructions based on the content',
    'extract-key-points': 'extract key points and FAQs from the content'
  };
  
  return actionMap[action] || 'process the text into a structured document';
};