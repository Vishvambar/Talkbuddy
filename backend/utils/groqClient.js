import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config();

// Create Axios client for Groq API
const client = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Send a chat request to Groq API (non-streaming)
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} model - Model name to use
 * @returns {Promise<string>} - The response content
 */
export async function chatWithGroq(messages, model = 'llama3-8b-8192') {
  // If messages is a string, convert it to a proper messages array
  if (typeof messages === 'string') {
    messages = [
      { role: 'system', content: 'You are TalkBuddy, a friendly language learning assistant.' },
      { role: 'user', content: messages }
    ];
  }
  
  const response = await client.post('/chat/completions', {
    model,
    messages
  });

  return response.data.choices[0].message.content;
}

/**
 * Stream a chat response from Groq API
 * @param {Array|string} messages - Array of message objects or a string message
 * @param {Function} onChunk - Callback function for each chunk of the response
 * @param {string} model - Model name to use
 * @returns {Promise<string>} - The complete response content
 */
export async function streamChatWithGroq(messages, onChunk, model = 'llama3-8b-8192') {
  // If messages is a string, convert it to a proper messages array
  if (typeof messages === 'string') {
    messages = [
      { role: 'system', content: 'You are TalkBuddy, a friendly language learning assistant.' },
      { role: 'user', content: messages }
    ];
  }
  
  try {
    const response = await client.post('/chat/completions', {
      model,
      messages,
      stream: true
    }, {
      responseType: 'stream'
    });
    
    let fullResponse = '';
    
    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        try {
          // Parse the chunk data
          const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            // Skip lines that don't start with 'data:'
            if (!line.startsWith('data:')) continue;
            
            // Skip '[DONE]' message
            if (line === 'data: [DONE]') continue;
            
            // Extract the JSON data
            const jsonData = line.replace(/^data: /, '');
            
            try {
              const parsedData = JSON.parse(jsonData);
              const content = parsedData.choices[0]?.delta?.content || '';
              
              if (content) {
                fullResponse += content;
                if (onChunk && typeof onChunk === 'function') {
                  onChunk(content);
                }
              }
            } catch (parseError) {
              console.error('Error parsing chunk:', parseError);
            }
          }
        } catch (error) {
          console.error('Error processing chunk:', error);
        }
      });
      
      response.data.on('end', () => {
        resolve(fullResponse);
      });
      
      response.data.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error in streamChatWithGroq:', error);
    throw error;
  }
}