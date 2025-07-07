# AWS Services Setup Guide

This guide provides detailed instructions for setting up the required AWS services for the Notes Processor application.

## Prerequisites

- AWS account
- AWS CLI installed and configured with appropriate credentials

## 1. Create an IAM User

First, create an IAM user with programmatic access and the necessary permissions:

1. Go to the AWS Management Console and navigate to IAM
2. Click "Users" and then "Add user"
3. Enter a username (e.g., "notes-processor-app")
4. Select "Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search for and select the following policies:
   - AmazonS3FullAccess
   - AmazonDynamoDBFullAccess
   - AmazonTextractFullAccess
8. Click "Next: Tags" (optional: add tags)
9. Click "Next: Review"
10. Click "Create user"
11. **IMPORTANT**: Save the Access Key ID and Secret Access Key securely. You will need these for your application.

## 2. Create an S3 Bucket

Create an S3 bucket to store uploaded files and generated documents:

1. Go to the AWS Management Console and navigate to S3
2. Click "Create bucket"
3. Enter a bucket name (e.g., "notes-processor-uploads")
4. Select a region (e.g., "us-east-1")
5. Configure bucket settings:
   - Block all public access (recommended for security)
   - Enable versioning (optional)
   - Enable encryption (recommended)
6. Click "Create bucket"

### Configure CORS for the S3 Bucket

1. Select your bucket and go to the "Permissions" tab
2. Scroll down to "Cross-origin resource sharing (CORS)"
3. Click "Edit" and add the following configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:12000", "https://yourusername.github.io"],
    "ExposeHeaders": ["ETag"]
  }
]
```

Replace `https://yourusername.github.io` with your actual frontend domain.

## 3. Create DynamoDB Tables

### Users Table

1. Go to the AWS Management Console and navigate to DynamoDB
2. Click "Create table"
3. Enter table details:
   - Table name: "notes-processor-users"
   - Primary key: "id" (String)
4. Leave default settings and click "Create"
5. Once created, go to the "Indexes" tab
6. Click "Create index"
7. Create a Global Secondary Index:
   - Partition key: "email" (String)
   - Index name: "EmailIndex"
   - Projected attributes: "All"
8. Click "Create index"

### Documents Table

1. Go to the AWS Management Console and navigate to DynamoDB
2. Click "Create table"
3. Enter table details:
   - Table name: "notes-processor-documents"
   - Primary key: "id" (String)
4. Leave default settings and click "Create"
5. Once created, go to the "Indexes" tab
6. Click "Create index"
7. Create a Global Secondary Index:
   - Partition key: "userId" (String)
   - Index name: "UserIdIndex"
   - Projected attributes: "All"
8. Click "Create index"

## 4. Set Up Amazon Textract

Amazon Textract is already set up and ready to use with your AWS account. You don't need to create any resources for it, but you need to ensure your IAM user has the necessary permissions (which we added in step 1).

## 5. (Optional) Set Up Amazon Cognito for Frontend Authentication

If you want to use Amazon Cognito for frontend authentication instead of your custom JWT solution:

1. Go to the AWS Management Console and navigate to Cognito
2. Click "Manage User Pools"
3. Click "Create a user pool"
4. Enter a pool name (e.g., "notes-processor-users")
5. Configure sign-in options (email, username, etc.)
6. Configure security requirements
7. Configure MFA (optional)
8. Configure email verification
9. Configure app clients:
   - Add an app client name (e.g., "notes-processor-web-client")
   - Uncheck "Generate client secret" for browser-based applications
10. Configure workflows and customize messages
11. Review and create the user pool
12. Note the User Pool ID and App Client ID

### Create an Identity Pool for AWS SDK Access

1. Go to the AWS Management Console and navigate to Cognito
2. Click "Manage Identity Pools"
3. Click "Create new identity pool"
4. Enter a name (e.g., "notes-processor-identity-pool")
5. Configure authentication providers:
   - Select "Cognito" tab
   - Enter your User Pool ID and App Client ID
6. Configure roles:
   - Create new roles or use existing roles
   - Ensure the authenticated role has access to S3, DynamoDB, and Textract
7. Review and create the identity pool
8. Note the Identity Pool ID

## 6. Update Environment Variables

Update your backend `.env` file with the AWS credentials and resource names:

```
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# S3 Configuration
S3_BUCKET_NAME=notes-processor-uploads

# DynamoDB Configuration
DYNAMODB_TABLE_USERS=notes-processor-users
DYNAMODB_TABLE_DOCUMENTS=notes-processor-documents
```

Update your frontend `.env` file with the AWS configuration:

```
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET=notes-processor-uploads
VITE_IDENTITY_POOL_ID=your-identity-pool-id  # If using Cognito
```

## 7. Security Best Practices

1. **IAM Policies**: Follow the principle of least privilege. Refine the IAM policies to only grant the necessary permissions.

2. **S3 Bucket Policies**: Ensure your S3 bucket is not publicly accessible unless required.

3. **Encryption**: Enable encryption for data at rest and in transit.

4. **Access Logging**: Enable access logging for your S3 bucket and DynamoDB tables.

5. **Regular Rotation**: Regularly rotate your AWS access keys.

6. **Environment Variables**: Never commit AWS credentials to your code repository. Always use environment variables or AWS parameter store.

7. **VPC Endpoints**: Consider using VPC endpoints for added security if your backend is deployed in a VPC.

## 8. Cost Management

1. **S3 Lifecycle Rules**: Set up lifecycle rules to move older objects to cheaper storage classes or delete them after a certain period.

2. **DynamoDB Capacity**: Use on-demand capacity mode for unpredictable workloads or provisioned capacity for predictable workloads.

3. **CloudWatch Alarms**: Set up CloudWatch alarms to alert you when costs exceed a certain threshold.

4. **AWS Budgets**: Set up AWS Budgets to track and manage your AWS costs.

5. **Free Tier**: Be aware of the AWS Free Tier limits and monitor your usage to avoid unexpected charges.