import express, { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateSpotifyUser } from '../middlewares/authenticateSpotifyUser';
import { login, callback } from '../controllers/auth.controller';
import { geminiChatHandler } from '../controllers/gemini.controller';
import {
  handleGetAlbumInfo,
  handleGetPlaylistInfo,
  handleGetPlaylistTracks,
  followAlbum,
  albumFollowRemove,
  FollowPlaylist,
  UnfollowPlaylist,
  GetNewReleases,
  GetFollowedAlbum,
  GetFollowedPlaylist,
  getPlaybackStateController,
  startOrResumePlaybackController,
  pausePlaybackController,
  skipToNextController,
  skipToPreviousController,
  seekToPositionController,
  setPlaybackVolumeController,
  addItemToQueueController,
  getUserProfileController,
  getPlaylistStatus,
  getAlbumStatus,
} from '../controllers/spotify.controller';

const router = express.Router();

router.use('/spotify', asyncHandler(authenticateSpotifyUser));

router.get('/auth/login', login);
router.get('/auth/callback', callback);

router.post(
  '/gemini/chat',
  asyncHandler(authenticateSpotifyUser),
  geminiChatHandler as RequestHandler
);

router.get('/spotify/player', getPlaybackStateController);
router.put(
  '/spotify/player/play',
  startOrResumePlaybackController as RequestHandler
);
router.put('/spotify/player/pause', pausePlaybackController);
router.post('/spotify/player/next', skipToNextController);
router.post('/spotify/player/previous', skipToPreviousController);
router.put('/spotify/player/seek', seekToPositionController as RequestHandler);
router.put(
  '/spotify/player/volume',
  setPlaybackVolumeController as RequestHandler
);
router.post(
  '/spotify/player/queue',
  addItemToQueueController as RequestHandler
);

router.get('/spotify/profile', getUserProfileController);

router.get('/spotify/album/:albumId', handleGetAlbumInfo as RequestHandler);
router.get(
  '/spotify/playlist/:playlistId',
  handleGetPlaylistInfo as RequestHandler
);
router.get(
  '/spotify/playlist-tracks/:playlistId',
  handleGetPlaylistTracks as RequestHandler
);

router.put('/spotify/album/follow/:albumId', followAlbum as RequestHandler);
router.delete(
  '/spotify/album/follow/:albumId',
  albumFollowRemove as RequestHandler
);

router.put(
  '/spotify/playlist/:playlistId/follow',
  FollowPlaylist as RequestHandler
);
router.delete(
  '/spotify/playlist/:playlistId/follow',
  UnfollowPlaylist as RequestHandler
);

router.get('/spotify/new-releases', GetNewReleases);
router.get('/spotify/followed/albums', GetFollowedAlbum);
router.get('/spotify/followed/playlists', GetFollowedPlaylist);

router.get('/spotify/album/:albumId/status', getAlbumStatus as RequestHandler);
router.get('/spotify/playlist/:playlistId/status', getPlaylistStatus as RequestHandler);



export default router;
