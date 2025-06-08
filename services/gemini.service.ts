import axios from 'axios';
import { API_KEY } from '../config/index';

const EMOTION_INSTRUCTION = `다음 문장에서 느껴지는 감정을 한 단어로 추출해주세요. 예: happy, sad, angry, relaxed 등. 반드시 키워드만 출력해야 합니다.`;

export const askGemini = async (prompt: string): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [
        { 
          text: `${EMOTION_INSTRUCTION}\n문장: ${prompt}`
        }
      ]
    }]
  };

  const response = await axios.post(url, requestBody, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // 결과 전처리
  const result = response.data.candidates[0].content.parts[0].text;
  return result.trim().toLowerCase(); // 공백 제거 및 소문자 통일
};
