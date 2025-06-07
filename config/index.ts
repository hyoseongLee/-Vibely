import dotenv from 'dotenv';

dotenv.config();

export const SPOTIFY_CONFIG = {
  clientId: process.env.SPOTIFY_CLIENT_ID || '',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || '',
};
