# Backend Deployment Guide

This guide provides instructions for deploying the Notes Processor backend to various cloud platforms.

## Option 1: AWS Elastic Beanstalk

### Prerequisites
- AWS account
- AWS CLI installed and configured
- EB CLI installed

### Steps

1. **Initialize Elastic Beanstalk in your project**

```bash
cd backend
eb init
```

Follow the prompts to configure your EB environment.

2. **Create an Elastic Beanstalk environment**

```bash
eb create notes-processor-backend
```

3. **Configure environment variables**

Go to the AWS Management Console > Elastic Beanstalk > Your Environment > Configuration > Software > Environment properties and add all the required environment variables from your `.env` file.

4. **Deploy your application**

```bash
eb deploy
```

5. **Get your application URL**

```bash
eb status
```

Use this URL as your backend API endpoint in your frontend configuration.

## Option 2: Render

### Prerequisites
- Render account (https://render.com)
- Git repository with your code

### Steps

1. **Log in to Render and create a new Web Service**

2. **Connect your GitHub repository**

3. **Configure the service**
   - Name: notes-processor-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select the appropriate plan

4. **Add environment variables**
   - Add all the variables from your `.env` file

5. **Deploy the service**
   - Click "Create Web Service"

6. **Get your application URL**
   - Once deployed, Render will provide a URL for your service
   - Use this URL as your backend API endpoint in your frontend configuration

## Option 3: Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Log in to Heroku**

```bash
heroku login
```

2. **Create a new Heroku app**

```bash
cd backend
heroku create notes-processor-backend
```

3. **Add a Procfile**

Create a file named `Procfile` (no extension) in your backend directory with:

```
web: node server.js
```

4. **Configure environment variables**

```bash
heroku config:set JWT_SECRET=your_jwt_secret_key_change_in_production
heroku config:set JWT_EXPIRES_IN=7d
heroku config:set AWS_REGION=us-east-1
heroku config:set AWS_ACCESS_KEY_ID=your_aws_access_key_id
heroku config:set AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
heroku config:set S3_BUCKET_NAME=notes-processor-uploads
heroku config:set DYNAMODB_TABLE_USERS=notes-processor-users
heroku config:set DYNAMODB_TABLE_DOCUMENTS=notes-processor-documents
heroku config:set AI_MODEL_ENDPOINT=http://localhost:11434/api/generate
heroku config:set AI_MODEL_NAME=llama3
```

5. **Deploy to Heroku**

```bash
git add .
git commit -m "Add Procfile for Heroku"
git push heroku main
```

6. **Get your application URL**

```bash
heroku open
```

Use this URL as your backend API endpoint in your frontend configuration.

## Connecting Frontend to Deployed Backend

Once you have deployed your backend, update your frontend configuration to point to the new backend URL:

1. **Update .env.production file**

```
VITE_API_URL=https://your-backend-url.com/api
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET=notes-processor-uploads
VITE_IDENTITY_POOL_ID=your-identity-pool-id
```

2. **Rebuild and redeploy your frontend**

```bash
cd frontend
npm run build
npm run deploy  # If using GitHub Pages
```

## Important Security Considerations

1. **CORS Configuration**

Make sure your backend has proper CORS configuration to allow requests from your frontend domain:

```javascript
// In server.js
app.use(cors({
  origin: ['https://yourusername.github.io', 'http://localhost:12000'],
  credentials: true
}));
```

2. **HTTPS**

Ensure your backend is served over HTTPS, especially in production.

3. **Environment Variables**

Never commit sensitive environment variables to your repository. Use the platform's environment variable management system.

4. **API Keys and Secrets**

Ensure all API keys and secrets are properly secured and not exposed to the client.

5. **Rate Limiting**

Implement rate limiting to prevent abuse:

```javascript
// In server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

6. **Regular Updates**

Regularly update your dependencies to patch security vulnerabilities.