import { Request, Response } from 'express';
import {
  getAlbumInfo,
  getPlaylistInfo,
  getPlaylistTracks,
} from '../services/spotify.service';

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
