import { Request, Response } from 'express';

import { getLoginUrl, getTokensFromCode } from '../services/spotify.service';

import { upsertUserToken } from '../models/user.model';

export const login = (req: Request, res: Response) => {
  const url = getLoginUrl();
  res.redirect(url);
};

export const callback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const tokens = await getTokensFromCode(code);
  const { spotify_id, access_token, refresh_token } = tokens;

  await upsertUserToken({
    spotifyId: spotify_id,
    accessToken: access_token,
    refreshToken: refresh_token,
  });

  res.json({
    message: 'Login success',
    access_token,
  });
};
