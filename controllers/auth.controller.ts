import { Request, Response } from 'express';
import { getLoginUrl, getTokensFromCode } from '../services/spotify.service';
import { upsertUserToken } from '../models/user.model';
import dotenv from 'dotenv';
dotenv.config();

export const login = (req: Request, res: Response) => {
  const url = getLoginUrl();
  res.redirect(url);
};

export const callback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const tokens = await getTokensFromCode(code);
    const { spotify_id, access_token, refresh_token } = tokens;

    await upsertUserToken({
      spotifyId: spotify_id,
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    res.redirect(`${process.env.FRONTEND_URL}?spotifyId=${spotify_id}`);
  } catch (error) {
    const err = error as any;
    console.log('Spotify 토큰 수신 실패:', err.response?.data || err.message);
    res.status(500).json({ error: '토큰 요청 실패' });
  }
};
