# AI Integration Guide

This guide provides instructions for setting up and integrating AI capabilities into the Notes Processor application.

## Option 1: Local LLM with Ollama

### Prerequisites

- A computer with sufficient resources to run LLMs (8GB+ RAM recommended)
- Ollama installed (https://ollama.ai/)

### Installation

1. **Install Ollama**

   - **macOS**: Download from https://ollama.ai/
   - **Linux**:
     ```bash
     curl -fsSL https://ollama.ai/install.sh | sh
     ```
   - **Windows**: Use WSL2 with the Linux installation method

2. **Pull the Llama 3 model**

   ```bash
   ollama pull llama3
   ```

   This will download the model (approximately 4GB).

3. **Start the Ollama server**

   ```bash
   ollama serve
   ```

   This will start the Ollama server on port 11434.

### Configuration

1. **Update your backend `.env` file**

   ```
   AI_MODEL_ENDPOINT=http://localhost:11434/api/generate
   AI_MODEL_NAME=llama3
   ```

2. **Test the AI integration**

   You can test the AI integration with a simple curl command:

   ```bash
   curl -X POST http://localhost:11434/api/generate -d '{
     "model": "llama3",
     "prompt": "Create a brief summary about artificial intelligence."
   }'
   ```

## Option 2: Hugging Face Inference API

### Prerequisites

- Hugging Face account (https://huggingface.co/)
- API token from Hugging Face

### Setup

1. **Create a Hugging Face account**

2. **Get an API token**
   - Go to https://huggingface.co/settings/tokens
   - Create a new token with read access

3. **Update your backend `.env` file**

   ```
   AI_MODEL_ENDPOINT=https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2
   HUGGINGFACE_API_TOKEN=your_huggingface_api_token
   ```

4. **Update the AI processor utility**

   Modify `/backend/utils/aiProcessor.js` to use the Hugging Face API:

   ```javascript
   const axios = require('axios');

   const processText = async (text, purpose, subject, action) => {
     try {
       const response = await axios.post(
         process.env.AI_MODEL_ENDPOINT,
         {
           inputs: generatePrompt(text, purpose, subject, action),
           parameters: {
             max_new_tokens: 1024,
             temperature: 0.7,
             top_p: 0.95,
             do_sample: true
           }
         },
         {
           headers: {
             'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
             'Content-Type': 'application/json'
           }
         }
       );

       return response.data[0].generated_text;
     } catch (error) {
       console.error('Error processing text with AI:', error);
       throw new Error('Failed to process text with AI model');
     }
   };

   const generatePrompt = (text, purpose, subject, action) => {
     return `
     You are an expert document creator. Transform the following text into a well-structured ${purpose} about ${subject}.
     
     The action required is: ${action}
     
     Original text:
     ${text}
     
     Create a professional, well-formatted document that follows best practices for a ${purpose}.
     `;
   };

   module.exports = { processText };
   ```

## Option 3: OpenAI API

### Prerequisites

- OpenAI API key (https://platform.openai.com/)

### Setup

1. **Create an OpenAI account**

2. **Get an API key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key

3. **Update your backend `.env` file**

   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Install the OpenAI SDK**

   ```bash
   cd backend
   npm install openai
   ```

5. **Update the AI processor utility**

   Modify `/backend/utils/aiProcessor.js` to use the OpenAI API:

   ```javascript
   const { OpenAI } = require('openai');

   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY
   });

   const processText = async (text, purpose, subject, action) => {
     try {
       const response = await openai.chat.completions.create({
         model: "gpt-3.5-turbo",
         messages: [
           {
             role: "system",
             content: `You are an expert document creator specializing in creating ${purpose} documents.`
           },
           {
             role: "user",
             content: generatePrompt(text, purpose, subject, action)
           }
         ],
         temperature: 0.7,
         max_tokens: 1500
       });

       return response.choices[0].message.content;
     } catch (error) {
       console.error('Error processing text with OpenAI:', error);
       throw new Error('Failed to process text with AI model');
     }
   };

   const generatePrompt = (text, purpose, subject, action) => {
     return `
     Transform the following text into a well-structured ${purpose} about ${subject}.
     
     The action required is: ${action}
     
     Original text:
     ${text}
     
     Create a professional, well-formatted document that follows best practices for a ${purpose}.
     `;
   };

   module.exports = { processText };
   ```

## Option 4: AWS Bedrock

### Prerequisites

- AWS account with Bedrock access
- AWS CLI configured with appropriate permissions

### Setup

1. **Enable AWS Bedrock**
   - Go to the AWS Management Console
   - Navigate to Amazon Bedrock
   - Request access to the models you want to use

2. **Update IAM permissions**
   - Add the `AmazonBedrockFullAccess` policy to your IAM user

3. **Install the AWS SDK for Bedrock**

   ```bash
   cd backend
   npm install @aws-sdk/client-bedrock-runtime
   ```

4. **Update the AI processor utility**

   Modify `/backend/utils/aiProcessor.js` to use AWS Bedrock:

   ```javascript
   const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

   const client = new BedrockRuntimeClient({
     region: process.env.AWS_REGION
   });

   const processText = async (text, purpose, subject, action) => {
     try {
       const prompt = generatePrompt(text, purpose, subject, action);
       
       const input = {
         modelId: 'anthropic.claude-v2',
         contentType: 'application/json',
         accept: 'application/json',
         body: JSON.stringify({
           prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
           max_tokens_to_sample: 1500,
           temperature: 0.7,
           top_p: 0.95
         })
       };

       const command = new InvokeModelCommand(input);
       const response = await client.send(command);

       const responseBody = JSON.parse(new TextDecoder().decode(response.body));
       return responseBody.completion;
     } catch (error) {
       console.error('Error processing text with AWS Bedrock:', error);
       throw new Error('Failed to process text with AI model');
     }
   };

   const generatePrompt = (text, purpose, subject, action) => {
     return `
     Transform the following text into a well-structured ${purpose} about ${subject}.
     
     The action required is: ${action}
     
     Original text:
     ${text}
     
     Create a professional, well-formatted document that follows best practices for a ${purpose}.
     `;
   };

   module.exports = { processText };
   ```

## Internet Research Integration

To enhance the AI's capabilities with internet research, you can integrate a search API:

### Using SerpAPI

1. **Sign up for SerpAPI**
   - Go to https://serpapi.com/
   - Create an account and get an API key

2. **Install the SerpAPI client**

   ```bash
   cd backend
   npm install serpapi
   ```

3. **Create a research utility**

   Create a new file `/backend/utils/researchUtil.js`:

   ```javascript
   const { getJson } = require('serpapi');

   const conductResearch = async (topic) => {
     try {
       const results = await getJson({
         api_key: process.env.SERPAPI_API_KEY,
         engine: 'google',
         q: topic,
         num: 5
       });

       const organicResults = results.organic_results || [];
       
       // Extract relevant information
       return organicResults.map(result => ({
         title: result.title,
         link: result.link,
         snippet: result.snippet
       }));
     } catch (error) {
       console.error('Error conducting research:', error);
       return [];
     }
   };

   module.exports = { conductResearch };
   ```

4. **Integrate research into the AI processor**

   Update `/backend/utils/aiProcessor.js` to include research:

   ```javascript
   const { conductResearch } = require('./researchUtil');

   const processText = async (text, purpose, subject, action) => {
     try {
       // Conduct research if needed
       let researchResults = [];
       if (action.includes('research') || purpose === 'Standard Operating Procedure' || purpose === 'Policy Document') {
         researchResults = await conductResearch(subject);
       }

       // Rest of your AI processing code...
       
       // Include research results in the prompt
       const prompt = generatePrompt(text, purpose, subject, action, researchResults);
       
       // Continue with your existing code to call the AI model...
     } catch (error) {
       console.error('Error processing text with AI:', error);
       throw new Error('Failed to process text with AI model');
     }
   };

   const generatePrompt = (text, purpose, subject, action, researchResults = []) => {
     let researchSection = '';
     
     if (researchResults.length > 0) {
       researchSection = `
       Here are some research findings about ${subject} that you should incorporate:
       
       ${researchResults.map((result, index) => `
       Source ${index + 1}: ${result.title}
       URL: ${result.link}
       Summary: ${result.snippet}
       `).join('\n')}
       `;
     }
     
     return `
     Transform the following text into a well-structured ${purpose} about ${subject}.
     
     The action required is: ${action}
     
     Original text:
     ${text}
     
     ${researchSection}
     
     Create a professional, well-formatted document that follows best practices for a ${purpose}.
     `;
   };

   module.exports = { processText };
   ```

5. **Update your backend `.env` file**

   ```
   SERPAPI_API_KEY=your_serpapi_api_key
   ```

## Security Considerations

1. **API Keys**: Never expose API keys in your frontend code. Always make AI requests through your backend.

2. **Rate Limiting**: Implement rate limiting to prevent abuse of your AI endpoints.

3. **Content Filtering**: Consider implementing content filtering to prevent inappropriate content.

4. **Cost Management**: Monitor your API usage to avoid unexpected costs, especially with paid services like OpenAI.

5. **Error Handling**: Implement robust error handling to gracefully handle API failures.

6. **Fallback Mechanisms**: Consider implementing fallback mechanisms if one AI service is unavailable.