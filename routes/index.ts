import express from 'express';
import { login, callback } from '../controllers/auth.controller';
import { geminiChatHandler } from '../controllers/gemini.controller';
import {
  handleGetAlbumInfo,
  handleGetPlaylistInfo,
  handleGetPlaylistTracks,
} from '../controllers/spotify.controller';

const router = express.Router();

router.get('/auth/login', login);
router.get('/auth/callback', callback);

router.post('/gemini/chat', geminiChatHandler);

router.get('/spotify/album/:spotifyId/:albumId', handleGetAlbumInfo);
router.get('/spotify/playlist/:spotifyId/:playlistId', handleGetPlaylistInfo);
router.get(
  '/spotify/playlist-tracks/:spotifyId/:playlistId',
  handleGetPlaylistTracks
);

export default router;
