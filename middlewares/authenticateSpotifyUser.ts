import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import qs from 'qs';
import pool from '../database/mariadb';

const refreshAccessToken = async (refreshToken: string) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
    }
  );

  return response.data.access_token;
};

export const authenticateSpotifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ message: 'Authorization header missing or invalid' });
    return;
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const [rows]: any = await pool.query(
      'SELECT spotifyId, refreshToken FROM users WHERE accessToken = ?',
      [accessToken]
    );

    if (!rows[0]) {
      res.status(401).json({ message: '해당 사용자를 찾을 수 없습니다.' });
      return;
    }

    let { spotifyId, refreshToken } = rows[0];

    try {
      await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err: any) {
      if (err.response?.status === 401 && refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        await pool.query(
          'UPDATE users SET accessToken = ? WHERE spotifyId = ?',
          [newAccessToken, spotifyId]
        );
        req.user = { spotifyId, accessToken: newAccessToken };
      } else {
        console.error('Spotify 인증 실패:', err);
        res.status(401).json({ message: '유효하지 않은 access token' });
        return;
      }
    }

    req.user = { accessToken };
    next();
  } catch (error) {
    console.error('attachUserFromSpotifyId 오류:', error);
    res.status(500).json({ message: '서버 오류 발생' });
    return;
  }
};
