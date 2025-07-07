import bcrypt from 'bcryptjs';
import { dynamoDB, userTableName } from '../config/awsConfig.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new user
 * @param {object} userData - User data
 * @returns {object} Created user
 */
export const createUser = async (userData) => {
  const { name, email, password } = userData;
  
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create user object
  const user = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  // Save user to DynamoDB
  const params = {
    TableName: userTableName,
    Item: user
  };
  
  await dynamoDB.put(params).promise();
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {object|null} User object or null if not found
 */
export const getUserByEmail = async (email) => {
  const params = {
    TableName: userTableName,
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
  
  const result = await dynamoDB.query(params).promise();
  
  return result.Items.length > 0 ? result.Items[0] : null;
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {object|null} User object or null if not found
 */
export const getUserById = async (id) => {
  const params = {
    TableName: userTableName,
    Key: {
      id
    }
  };
  
  const result = await dynamoDB.get(params).promise();
  
  if (!result.Item) {
    return null;
  }
  
  // Return user without password
  const { password, ...userWithoutPassword } = result.Item;
  return userWithoutPassword;
};

/**
 * Authenticate user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object|null} User object or null if authentication fails
 */
export const authenticateUser = async (email, password) => {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};