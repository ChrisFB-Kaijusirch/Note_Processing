import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create S3 service object
export const s3 = new AWS.S3();

// Create DynamoDB service object
export const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Create Textract service object
export const textract = new AWS.Textract();

// S3 bucket name
export const bucketName = process.env.S3_BUCKET_NAME;

// DynamoDB table names
export const userTableName = process.env.DYNAMODB_TABLE_USERS;
export const documentTableName = process.env.DYNAMODB_TABLE_DOCUMENTS;