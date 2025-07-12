import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config();


const client = axios.create({
    baseURL: 'https://api.groq.com/openai/v1',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  export async function chatWithGroq(messages, model = 'llama3-8b-8192') {
    const response = await client.post('/chat/completions', {
      model,
      messages
    });
  
    return response.data.choices[0].message.content;
  }   