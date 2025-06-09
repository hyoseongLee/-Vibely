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
} from '../services/spotify.service';

export const getPlaybackStateController = async (
  req: Request,
  res: Response
) => {
  try {
    const { accessToken } = req.user!;
    const state = await getPlaybackState(accessToken);
    res.status(200).json({ message: '재생 상태 조회 성공', state });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const startOrResumePlaybackController = async (
  req: Request,
  res: Response
) => {
  try {
    const { accessToken } = req.user!;
    const { uris, positionMs } = req.body;
    if (!uris)
      return res.status(400).json({ message: 'uris 값이 필요합니다.' });
    await startOrResumePlayback(accessToken, uris, positionMs);
    res.status(200).json({ message: '재생 또는 재개 성공' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const pausePlaybackController = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    await pausePlayback(accessToken);
    res.status(200).json({ message: '일시 정지 성공' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const skipToNextController = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    await skipToNext(accessToken);
    res.status(200).json({ message: '다음 곡 재생 성공' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const skipToPreviousController = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    await skipToPrevious(accessToken);
    res.status(200).json({ message: '이전 곡 재생 성공' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const seekToPositionController = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { positionMs } = req.body;
    if (typeof positionMs !== 'number') {
      return res
        .status(400)
        .json({ message: 'positionMs 값이 숫자여야 합니다.' });
    }
    await seekToPosition(accessToken, positionMs);
    res.status(200).json({ message: `${positionMs}ms 위치로 이동 성공` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const setPlaybackVolumeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { accessToken } = req.user!;
    const { volumePercent } = req.body;
    if (typeof volumePercent !== 'number') {
      return res
        .status(400)
        .json({ message: 'volumePercent 값이 숫자여야 합니다.' });
    }
    await setPlaybackVolume(accessToken, volumePercent);
    res.status(200).json({ message: `볼륨 ${volumePercent}% 설정 성공` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addItemToQueueController = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { uri } = req.body;
    if (!uri) return res.status(400).json({ message: 'uri 값이 필요합니다.' });
    await addItemToQueue(accessToken, uri);
    res.status(200).json({ message: '큐에 추가 성공' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfileController = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const profile = await getUserProfile(accessToken);
    res.status(200).json({ message: '프로필 조회 성공', profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetAlbumInfo = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { albumId } = req.params;
    if (!albumId)
      return res.status(400).json({ message: '앨범 ID가 필요합니다.' });
    const album = await getAlbumInfo(accessToken, albumId);
    res.status(200).json({ message: '앨범 정보 조회 성공', album });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetPlaylistInfo = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { playlistId } = req.params;
    if (!playlistId)
      return res.status(400).json({ message: '플레이리스트 ID가 필요합니다.' });
    const playlist = await getPlaylistInfo(accessToken, playlistId);
    res.status(200).json({ message: '플레이리스트 조회 성공', playlist });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGetPlaylistTracks = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { playlistId } = req.params;
    if (!playlistId)
      return res.status(400).json({ message: '플레이리스트 ID가 필요합니다.' });
    const tracks = await getPlaylistTracks(accessToken, playlistId);
    res.status(200).json({ message: '플레이리스트 트랙 조회 성공', tracks });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 앨범 팔로우
export const followAlbum = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { albumId } = req.params;
    if (!albumId)
      return res.status(400).json({ message: '앨범 ID가 필요합니다.' });
    await followAlbumService(albumId, accessToken);
    res.status(200).json({ message: '앨범 팔로우 성공' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 앨범 팔로우 취소
export const albumFollowRemove = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { albumId } = req.params;
    if (!albumId)
      return res.status(400).json({ message: '앨범 ID가 필요합니다.' });
    await removeFollowAlbumService(albumId, accessToken);
    res.status(200).json({ message: '앨범 언팔로우 성공' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 플레이리스트 팔로우
export const FollowPlaylist = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { playlistId } = req.params;
    if (!playlistId)
      return res.status(400).json({ message: '플레이리스트 ID가 필요합니다.' });
    await followPlaylistService(accessToken, playlistId);
    res
      .status(200)
      .json({ message: `플레이리스트(${playlistId}) 팔로우 성공` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 플레이리스트 언팔로우
export const UnfollowPlaylist = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const { playlistId } = req.params;
    if (!playlistId)
      return res.status(400).json({ message: '플레이리스트 ID가 필요합니다.' });
    await unfollowPlaylistService(accessToken, playlistId);
    res
      .status(200)
      .json({ message: `플레이리스트(${playlistId}) 언팔로우 성공` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 최신 발매 앨범 3개 가져오기
export const GetNewReleases = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const albums = await getNewReleasesService(accessToken);
    res.status(200).json({ message: '최신 앨범 조회 성공', albums });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 팔로우한 앨범 3개 가져오기
export const GetFollowedAlbum = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const albums = await getFollowedAlbumService(accessToken);
    res.status(200).json({ message: '팔로우한 앨범 조회 성공', albums });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 팔로우한 플레이리스트 3개 가져오기
export const GetFollowedPlaylist = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.user!;
    const playlists = await getFollowedPlayListService(accessToken);
    res
      .status(200)
      .json({ message: '팔로우한 플레이리스트 조회 성공', playlists });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
