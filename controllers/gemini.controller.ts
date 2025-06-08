import { Request, Response } from 'express';
import { askGemini } from '../services/gemini.service';

export const geminiChatHandler = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const result = await askGemini(prompt);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Gemini AI 처리 중 오류 발생' });
  }
};
