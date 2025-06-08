import express from 'express';
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
} from '../controllers/spotify.controller';

const router = express.Router();

router.get('/auth/login', login);
router.get('/auth/callback', callback);
router.post('/gemini/chat',geminiChatHandler)

router.get('/spotify/:spotifyId/player', getPlaybackStateController);
router.put('/spotify/:spotifyId/player/play', startOrResumePlaybackController);
router.put('/spotify/:spotifyId/player/pause', pausePlaybackController);
router.post('/spotify/:spotifyId/player/next', skipToNextController);
router.post('/spotify/:spotifyId/player/previous', skipToPreviousController);
router.put('/spotify/:spotifyId/player/seek', seekToPositionController);
router.put('/spotify/:spotifyId/player/volume',setPlaybackVolumeController);
router.post('/spotify/:spotifyId/player/queue', addItemToQueueController);
router.get('/spotify/:spotifyId/profile', getUserProfileController);

router.get('/spotify/album/:spotifyId/:albumId', handleGetAlbumInfo);
router.get('/spotify/playlist/:spotifyId/:playlistId', handleGetPlaylistInfo);
router.get(
  '/spotify/playlist-tracks/:spotifyId/:playlistId',
  handleGetPlaylistTracks
);

router.put('/spotify/album/follow/:spotifyId/:albumId', followAlbum);         
router.delete('/spotify/album/follow/:spotifyId/:albumId', albumFollowRemove);

router.put('/spotify/playlist/:playlistId/follow', FollowPlaylist);    
router.delete('/spotify/playlist/:playlistId/follow', UnfollowPlaylist); 

router.get('/spotify/new-releases', GetNewReleases);           
router.get('/spotify/followed/albums', GetFollowedAlbum);      
router.get('/spotify/followed/playlists', GetFollowedPlaylist); 

export default router;
