import axios from 'axios';
import pool from '../database/mariadb';
import { SPOTIFY_CONFIG } from '../config/index';

export const getLoginUrl = () => {
  const scopes = [
    'user-read-private',
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
  ].join(' ');

  const query = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CONFIG.clientId,
    scope: scopes,
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
  });

  return `https://accounts.spotify.com/authorize?${query.toString()}`;
};

export const getTokensFromCode = async (code: string) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
  });

  const tokenRes = await axios.post(
    'https://accounts.spotify.com/api/token',
    body.toString(),
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`
          ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const { access_token, refresh_token } = tokenRes.data;

  const userRes = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return {
    access_token,
    refresh_token,
    spotify_id: userRes.data.id,
  };
};

export const getUserAccessToken = (
  spotifyId: string
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT accessToken FROM users WHERE spotifyId = ?',
      [spotifyId],
      (err, results: any) => {
        if (err) return reject(err);
        const accessToken = results[0]?.accessToken ?? null;
        resolve(accessToken);
      }
    );
  });
};

export const getAlbumInfo = async (spotifyId: string, albumId: string) => {
  const accessToken = await getUserAccessToken(spotifyId);
  if (!accessToken) throw new Error('Access token not found.');

  const response = await axios.get(
    `https://api.spotify.com/v1/albums/${albumId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const album = response.data;

  return {
    id: album.id,
    name: album.name,
    releaseDate: album.release_date,
    imageUrl: album.images?.[0]?.url || null,
    totalTracks: album.total_tracks,
    artists: album.artists.map((artist: any) => artist.name),
    tracks: album.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      trackNumber: track.track_number,
      durationMs: track.duration_ms,
      isPlayable: track.is_playable,
      previewUrl: track.preview_url,
      linkedFromId: track.linked_from?.id || null,
    })),
  };
};

export const getPlaylistInfo = async (
  spotifyId: string,
  playlistId: string
) => {
  const accessToken = await getUserAccessToken(spotifyId);
  if (!accessToken) throw new Error('Access token not found.');

  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const playlist = response.data;

  return {
    name: playlist.name,
    imageUrl: playlist.images?.[0]?.url || null,
    public: playlist.public,
    ownerName: playlist.owner?.display_name || null,
    totalTracks: playlist.tracks?.total ?? 0,
    tracks:
      playlist.tracks?.items?.map((item: any) => {
        const track = item.track;
        return {
          id: track.id,
          name: track.name,
          isPlayable: track.is_playable,
          previewUrl: track.preview_url,
          linkedFromId: track.linked_from?.id || null,
          artistNames: track.artists?.map((artist: any) => artist.name),
        };
      }) || [],
  };
};

export const getPlaylistTracks = async (
  spotifyId: string,
  playlistId: string
) => {
  const accessToken = await getUserAccessToken(spotifyId);
  if (!accessToken) throw new Error('Access token not found');

  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 3,
      },
    }
  );

  const items = response.data.items;

  return items.map((item: any) => {
    const track = item.track;

    return {
      id: track.id,
      name: track.name,
      isPlayable: track.is_playable,
      previewUrl: track.preview_url,
      linkedFromId: track.linked_from?.id || null,
      artistNames: track.artists.map((artist: any) => artist.name),
      albumImage: track.album.images?.[0]?.url || null,
    };
  });
};

export const searchSpotifyPlaylist = async (
  query: string,
  spotifyId: string
) => {
  const accessToken = await getUserAccessToken(spotifyId);
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      q: query,
      type: 'playlist',
      limit: 1,
    },
  });

  const playlist = response.data.playlists.items[0];
  return {
    id: playlist.id,
    name: playlist.name,
    imageUrl: playlist.images?.[0]?.url || null,
    ownerId: playlist.owner?.id || null,
    ownerName: playlist.owner?.display_name || null,
  };
};
