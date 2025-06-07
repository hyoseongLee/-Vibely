import axios from 'axios';

import { SPOTIFY_CONFIG } from '../config/index';

export const getLoginUrl = () => {
  const scopes = [
    'user-read-private',
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
  ].join(' ');

  const query = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CONFIG.clientId,
    scope: scopes,
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
  });

  return `https://accounts.spotify.com/authorize?${query.toString()}`;
};

export const getTokensFromCode = async (code: string) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
  });

  const tokenRes = await axios.post(
    'https://accounts.spotify.com/api/token',
    body.toString(),
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`
          ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const { access_token, refresh_token } = tokenRes.data;

  const userRes = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return {
    access_token,
    refresh_token,
    spotify_id: userRes.data.id,
  };
};
