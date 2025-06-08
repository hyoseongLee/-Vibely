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

router.put('/spotify/album/follow/:spotifyId/:albumId', followAlbum);         
router.delete('/spotify/album/follow/:spotifyId/:albumId', albumFollowRemove);

router.put('/spotify/playlist/:playlistId/follow', FollowPlaylist);    
router.delete('/spotify/playlist/:playlistId/follow', UnfollowPlaylist); 

router.get('/spotify/new-releases', GetNewReleases);           
router.get('/spotify/followed/albums', GetFollowedAlbum);      
router.get('/spotify/followed/playlists', GetFollowedPlaylist); 

export default router;
