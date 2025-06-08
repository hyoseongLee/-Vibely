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
  getUserProfile,
  getAlbumInfo,
  getPlaylistInfo,
  getPlaylistTracks,
  followAlbumService, 
  removeFollowAlbumService, 
  followPlaylistService, 
  unfollowPlaylistService,
  getNewReleasesService,
  getFollowedAlbumService,
  getFollowedPlayListService,
  getUserAccessToken,
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

export const handleGetAlbumInfo = async (req: Request, res: Response) => {
  try {
    const { spotifyId, albumId } = req.params;
    const album = await getAlbumInfo(spotifyId, albumId);
    res.json(album);
  } catch (error) {
    const err = error as any;
    res
      .status(500)
      .json({ error: 'Failed to get album info', detail: err.message });
  }
};

export const handleGetPlaylistInfo = async (req: Request, res: Response) => {
  try {
    const { spotifyId, playlistId } = req.params;
    const playlist = await getPlaylistInfo(spotifyId, playlistId);
    res.json(playlist);
  } catch (error) {
    const err = error as any;
    res
      .status(500)
      .json({ error: 'Failed to get playlist info', detail: err.message });
  }
};

export const handleGetPlaylistTracks = async (req: Request, res: Response) => {
  try {
    const { spotifyId, playlistId } = req.params;
    const tracks = await getPlaylistTracks(spotifyId, playlistId);
    res.json(tracks);
  } catch (error) {
    const err = error as any;
    res
      .status(500)
      .json({ error: 'Failed to get playlist tracks', detail: err.message });
  }
};

// 앨범 팔로우
export const followAlbum = async (req: Request, res: Response): Promise<void> => {
  const { spotifyId, albumId } = req.params;

  if (!albumId) {
    res.status(400).json({ message: "Missing token or albumId" });
    return;
  }

  try {
    await followAlbumService(albumId, spotifyId);
    res.status(200).json({ message: "앨범 팔로우 성공" });
  } catch (err) {
    res.status(500).json({ message: "앨범 팔로우 실패", error: err });
  }
};

// 앨범 팔로우 취소
export const albumFollowRemove = async (req: Request, res: Response): Promise<void> => {
    try {
      const { spotifyId, albumId } = req.params;
  
      if (!albumId || !spotifyId) {
        res.status(400).json({ error: "앨범 ID와 사용자 ID가 필요합니다." });
        return;
      }
  
      await removeFollowAlbumService(albumId, spotifyId);
      res.status(200).json({ message: "앨범 팔로우가 취소되었습니다." });
    } catch (error) {
      console.error("앨범 삭제 오류:", error);
      res.status(500).json({ error: "서버 오류가 발생" });
    }
  };

// 플레이리스트 팔로우
export const FollowPlaylist = async (req: Request, res: Response): Promise<void> => {
    const { playlistId, spotifyId } = req.params;
  
    if (!playlistId || !spotifyId) {
      res.status(400).json({ message: "플레이리스트 ID와 Spotify ID가 필요합니다." });
      return;
    }
  
    const accessToken = await getUserAccessToken(spotifyId);
    if (!accessToken) {
      res.status(401).json({ message: "유효하지 않은 Spotify ID이거나 토큰이 없습니다." });
      return;
    }
  
    try {
      await followPlaylistService(accessToken, playlistId);
      res.status(200).json({ message: `플레이리스트(${playlistId})를 성공적으로 팔로우했습니다.` });
    } catch (error) {
      res.status(500).json({ message: "플레이리스트 팔로우에 실패했습니다.", error });
    }
  };
  
  // 플레이리스트 언팔로우
  export const UnfollowPlaylist = async (req: Request, res: Response): Promise<void> => {
    const { playlistId, spotifyId } = req.params;
  
    if (!playlistId || !spotifyId) {
      res.status(400).json({ message: "플레이리스트 ID와 Spotify ID가 필요합니다." });
      return;
    }
  
    const accessToken = await getUserAccessToken(spotifyId);
    if (!accessToken) {
      res.status(401).json({ message: "유효하지 않은 Spotify ID이거나 토큰이 없습니다." });
      return;
    }
  
    try {
      await unfollowPlaylistService(accessToken, playlistId);
      res.status(200).json({ message: `플레이리스트(${playlistId}) 팔로우를 취소했습니다.` });
    } catch (error) {
      res.status(500).json({ message: "플레이리스트 언팔로우에 실패했습니다.", error });
    }
  };
  
  // 최신 발매 앨범 3개 가져오기
  export const GetNewReleases = async (req: Request, res: Response): Promise<void> => {
    const { spotifyId } = req.params;
  
    if (!spotifyId) {
      res.status(400).json({ message: "Spotify ID가 필요합니다." });
      return;
    }
  
    const accessToken = await getUserAccessToken(spotifyId);
    if (!accessToken) {
      res.status(401).json({ message: "유효하지 않은 Spotify ID이거나 토큰이 없습니다." });
      return;
    }
  
    try {
      const albums = await getNewReleasesService(accessToken);
      res.status(200).json({ message: "최신 앨범 3개 불러오기 성공", albums });
    } catch (error) {
      res.status(500).json({ message: "최신 앨범 불러오기 실패", error });
    }
  };
  
  // 팔로우한 앨범 3개 가져오기
  export const GetFollowedAlbum = async (req: Request, res: Response): Promise<void> => {
    const { spotifyId } = req.params;
  
    if (!spotifyId) {
      res.status(400).json({ message: "Spotify ID가 필요합니다." });
      return;
    }
  
    const accessToken = await getUserAccessToken(spotifyId);
    if (!accessToken) {
      res.status(401).json({ message: "유효하지 않은 Spotify ID이거나 토큰이 없습니다." });
      return;
    }
  
    try {
      const albums = await getFollowedAlbumService(accessToken);
      res.status(200).json({ message: "팔로우한 앨범 3개 불러오기 성공", albums });
    } catch (error) {
      res.status(500).json({ message: "팔로우한 앨범 불러오기 실패", error });
    }
  };
  
  // 팔로우한 플레이리스트 3개 가져오기
  export const GetFollowedPlaylist = async (req: Request, res: Response): Promise<void> => {
    const { spotifyId } = req.params;
  
    if (!spotifyId) {
      res.status(400).json({ message: "Spotify ID가 필요합니다." });
      return;
    }
  
    const accessToken = await getUserAccessToken(spotifyId);
    if (!accessToken) {
      res.status(401).json({ message: "유효하지 않은 Spotify ID이거나 토큰이 없습니다." });
      return;
    }
  
    try {
      const playlists = await getFollowedPlayListService(accessToken);
      res.status(200).json({ message: "팔로우한 플레이리스트 3개 불러오기 성공", playlists });
    } catch (error) {
      res.status(500).json({ message: "팔로우한 플레이리스트 불러오기 실패", error });
    }
  };
