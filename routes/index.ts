import express from 'express';
import { login, callback } from '../controllers/auth.controller';
import { geminiChatHandler } from '../controllers/gemini.controller';
import  {
    getPlaybackStateController,
    startOrResumePlaybackController,
    pausePlaybackController,
    skipToNextController,
    skipToPreviousController,
    seekToPositionController,
    setPlaybackVolumeController,
    addItemToQueueController,
    getUserProfileController
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


export default router;