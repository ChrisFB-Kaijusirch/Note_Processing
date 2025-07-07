# Notes Processor

A full-stack web application that allows users to upload handwritten notes (as PDFs or images), transcribe and process them into structured documents, and store them securely in the cloud using AWS services.

## 🌟 Live Demo

The frontend of this application is deployed on GitHub Pages: [View Demo](https://chrisfb-kaijusirch.github.io/Note_Processing/)

## ✨ Features

- 📄 Upload handwritten notes as images or PDFs
- 📝 Process notes into various document types:
  - Knowledge Library Articles
  - Standard Operating Procedures (SOPs)
  - Training Manuals
  - Policy Documents
- 🤖 AI-powered text extraction and document generation
- 🔒 Secure user authentication
- 📚 Document management (view, search, download, print)
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React.js** with Vite for fast development
- 🧭 **React Router** for navigation
- 🎨 **Tailwind CSS** for responsive styling
- ☁️ **AWS SDK** for JavaScript

### Backend
- 🖥️ **Node.js** with Express
- ☁️ **AWS Services**:
  - S3 for file storage
  - Textract for text extraction
  - DynamoDB for database
- 🔑 **JWT** for authentication
- 📤 **Multer** for file uploads

### AI Processing
- 🧠 **Local LLM** integration (Ollama with Llama 3)

## 📋 Prerequisites

- 📦 Node.js (v16+)
- 📦 npm or yarn
- ☁️ AWS Account with appropriate permissions
- 🧠 Ollama or other local LLM setup (optional)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ChrisFB-Kaijusirch/Note_Processing.git
cd Note_Processing
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:12001/api
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with your AWS credentials and other configuration:

```
# Server Configuration
PORT=12001
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# S3 Configuration
S3_BUCKET_NAME=notes-processor-uploads

# DynamoDB Configuration
DYNAMODB_TABLE_USERS=notes-processor-users
DYNAMODB_TABLE_DOCUMENTS=notes-processor-documents

# AI Model Configuration
AI_MODEL_ENDPOINT=http://localhost:11434/api/generate
AI_MODEL_NAME=llama3
```

### 4. AWS Setup

#### Create S3 Bucket

1. Go to the AWS Management Console
2. Navigate to S3
3. Create a new bucket named `notes-processor-uploads` (or your preferred name)
4. Update the bucket name in your `.env` file

#### Create DynamoDB Tables

1. Navigate to DynamoDB in the AWS Console
2. Create a table named `notes-processor-users` with primary key `id` (string)
3. Create a GSI (Global Secondary Index) named `EmailIndex` with partition key `email`
4. Create a table named `notes-processor-documents` with primary key `id` (string)
5. Create a GSI named `UserIdIndex` with partition key `userId`

#### Set Up IAM User

1. Navigate to IAM in the AWS Console
2. Create a new user with programmatic access
3. Attach policies for S3, DynamoDB, and Textract access
4. Save the access key ID and secret access key in your `.env` file

### 5. AI Model Setup (Optional)

If you want to use a local LLM:

1. Install Ollama: https://ollama.ai/
2. Pull the Llama 3 model: `ollama pull llama3`
3. Start the Ollama server: `ollama serve`

## 🏃‍♂️ Running the Application

### Development Mode

#### Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at: http://localhost:12000

#### Backend

```bash
cd backend
npm run dev
```

The backend API will be available at: http://localhost:12001

### Production Build

#### Frontend

```bash
cd frontend
npm run build
```

This will create a production build in the `dist` directory.

#### Backend

```bash
cd backend
npm start
```

## 🌐 Deployment

### GitHub Pages (Frontend)

This repository is configured with GitHub Actions to automatically deploy the frontend to GitHub Pages when changes are pushed to the main branch.

For manual deployment:

1. Build the frontend: `npm run build`
2. Deploy to GitHub Pages: `npm run deploy`

### AWS Deployment

#### Frontend

1. Build the frontend: `npm run build`
2. Upload the contents of the `dist` directory to an S3 bucket configured for static website hosting
3. (Optional) Set up CloudFront for CDN distribution

#### Backend

1. Set up an EC2 instance or use AWS Elastic Beanstalk
2. Deploy the backend code to the instance
3. Configure environment variables
4. Set up a process manager like PM2: `pm2 start server.js`
5. (Optional) Set up a domain name and SSL certificate

### Additional Deployment Options

For more detailed deployment instructions, see:
- [GitHub Pages Deployment Guide](./GITHUB_PAGES_DEPLOYMENT.md)
- [Backend Deployment Guide](./BACKEND_DEPLOYMENT.md)
- [AWS Setup Guide](./AWS_SETUP.md)

## 🔒 Security Considerations

- 🔐 Always use HTTPS in production
- 🔑 Store sensitive information in environment variables
- ✅ Implement proper input validation
- 🛡️ Use secure authentication practices
- 🌐 Set up proper CORS configuration
- ⚠️ Implement rate limiting to prevent abuse
- 🔄 Regularly update dependencies

For more detailed security information, see the [AWS Setup Guide](./AWS_SETUP.md) and [AI Integration Guide](./AI_INTEGRATION.md).

## 📝 License

[MIT License](LICENSE)

---

## 📚 Documentation

For more detailed information about the application, check out these guides:

- [GitHub Setup Guide](./GITHUB_SETUP.md)
- [GitHub Pages Deployment Guide](./GITHUB_PAGES_DEPLOYMENT.md)
- [Backend Deployment Guide](./BACKEND_DEPLOYMENT.md)
- [AWS Setup Guide](./AWS_SETUP.md)
- [AI Integration Guide](./AI_INTEGRATION.md)
- [Notes Processor Summary](./NOTES_PROCESSOR_SUMMARY.md)