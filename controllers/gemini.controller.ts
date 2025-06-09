import { Request, Response } from 'express';
import { askGemini } from '../services/gemini.service';
import { searchSpotifyPlaylist } from '../services/spotify.service';

export const geminiChatHandler = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const { accessToken } = req.user!;

    if (!prompt) {
      return res.status(400).json({ message: 'prompt 값이 필요합니다.' });
    }

    const emotion = await askGemini(prompt);
    const playlist = await searchSpotifyPlaylist(emotion, accessToken);
    res
      .status(200)
      .json({ message: '추천 플레이리스트 생성 성공', result: playlist });
  } catch (error) {
    res.status(500).json({ message: 'Gemini AI 처리 중 오류 발생' });
  }
};
