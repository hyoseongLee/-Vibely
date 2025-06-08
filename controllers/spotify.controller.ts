import { Request, Response } from 'express';
import {
  getPlaybackState,
  startOrResumePlayback,
  pausePlayback,
  skipToNext,
  skipToPrevious,
  seekToPosition,
  setPlaybackVolume,
  addItemToQueue,
  getUserProfile
} from '../services/spotify.service';

export const getPlaybackStateController = async (req: Request, res: Response) => {
  try {
    const { spotifyId } = req.params;
    const state = await getPlaybackState(spotifyId);
    res.json(state);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const startOrResumePlaybackController = async (req: Request, res: Response) => {
  try {
    const { spotifyId } = req.params;
    const { uris, positionMs } = req.body;
    await startOrResumePlayback(spotifyId, uris, positionMs);
    res.json({ message: '재생 혹은 재개.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const pausePlaybackController = async (req: Request, res: Response) => {
  try {
    const { spotifyId } = req.params;
    await pausePlayback(spotifyId);
    res.json({ message: '일시 정지.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const skipToNextController = async (req: Request, res: Response) => {
  try {
    const { spotifyId } = req.params;
    await skipToNext(spotifyId);
    res.json({ message: '다음 곡 재생 .' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const skipToPreviousController = async (req: Request, res: Response) => {
  try {
    const { spotifyId } = req.params;
    await skipToPrevious(spotifyId);
    res.json({ message: '이전 곡 재생.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const seekToPositionController = async (req: Request, res: Response) => {
  try {
    const { spotifyId } = req.params;
    const { positionMs } = req.body;
    await seekToPosition(spotifyId, positionMs);
    res.json({ message: `특정 위치로 이동 ${positionMs}초.` });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const setPlaybackVolumeController = async (req: Request, res: Response) => {
    try {
      const { spotifyId } = req.params;
      const { volumePercent } = req.body;
      await setPlaybackVolume(spotifyId, volumePercent);
      res.json({ message: `소리조절 ${volumePercent}%` });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  export const addItemToQueueController = async (req: Request, res: Response) => {
    try {
      const { spotifyId } = req.params;
      const { uri } = req.body;
      await addItemToQueue(spotifyId, uri);
      res.json({ message: '트랙 추가.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
  
  export const getUserProfileController = async (req: Request, res: Response) => {
    try {
      const { spotifyId } = req.params;
      const profile = await getUserProfile(spotifyId);
      res.json(profile);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };