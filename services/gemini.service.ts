import axios from 'axios';

export const askGemini = async (prompt: string): Promise<string> => {
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const response = await axios.post(url, requestBody, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data.candidates[0].content.parts[0].text;
};
