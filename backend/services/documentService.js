import { dynamoDB, documentTableName } from '../config/awsConfig.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new document
 * @param {object} documentData - Document data
 * @returns {object} Created document
 */
export const createDocument = async (documentData) => {
  const { userId, title, subject, purpose, content, originalFileUrl, thumbnailUrl } = documentData;
  
  // Create document object
  const document = {
    id: uuidv4(),
    userId,
    title,
    subject,
    purpose,
    content,
    originalFileUrl,
    thumbnailUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Save document to DynamoDB
  const params = {
    TableName: documentTableName,
    Item: document
  };
  
  await dynamoDB.put(params).promise();
  
  return document;
};

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {object|null} Document object or null if not found
 */
export const getDocumentById = async (id) => {
  const params = {
    TableName: documentTableName,
    Key: {
      id
    }
  };
  
  const result = await dynamoDB.get(params).promise();
  
  return result.Item || null;
};

/**
 * Get documents by user ID
 * @param {string} userId - User ID
 * @returns {Array} Array of documents
 */
export const getDocumentsByUserId = async (userId) => {
  const params = {
    TableName: documentTableName,
    IndexName: 'UserIdIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };
  
  const result = await dynamoDB.query(params).promise();
  
  return result.Items;
};

/**
 * Update document
 * @param {string} id - Document ID
 * @param {object} updateData - Data to update
 * @returns {object} Updated document
 */
export const updateDocument = async (id, updateData) => {
  // Get current document
  const currentDocument = await getDocumentById(id);
  
  if (!currentDocument) {
    throw new Error('Document not found');
  }
  
  // Create update expression
  let updateExpression = 'set updatedAt = :updatedAt';
  const expressionAttributeValues = {
    ':updatedAt': new Date().toISOString()
  };
  
  // Add update fields
  Object.keys(updateData).forEach(key => {
    if (key !== 'id' && key !== 'userId' && key !== 'createdAt') {
      updateExpression += `, ${key} = :${key}`;
      expressionAttributeValues[`:${key}`] = updateData[key];
    }
  });
  
  // Update document in DynamoDB
  const params = {
    TableName: documentTableName,
    Key: {
      id
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };
  
  const result = await dynamoDB.update(params).promise();
  
  return result.Attributes;
};

/**
 * Delete document
 * @param {string} id - Document ID
 * @returns {boolean} True if deleted successfully
 */
export const deleteDocument = async (id) => {
  const params = {
    TableName: documentTableName,
    Key: {
      id
    }
  };
  
  await dynamoDB.delete(params).promise();
  
  return true;
};