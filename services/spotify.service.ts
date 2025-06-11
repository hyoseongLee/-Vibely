import axios from 'axios';
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

export const getAlbumInfo = async (accessToken: string, albumId: string) => {
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
  accessToken: string,
  playlistId: string
) => {
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
          albumImage: track.album?.images?.[0]?.url || null,
        };
      }) || [],
  };
};

export const getPlaylistTracks = async (
  accessToken: string,
  playlistId: string
) => {
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

export const getPlaybackState = async (accessToken: string) => {
  const response = await axios.get('https://api.spotify.com/v1/me/player', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const startOrResumePlayback = async (
  accessToken: string,
  uris?: string[],
  positionMs?: number
) => {
  await axios.put(
    'https://api.spotify.com/v1/me/player/play',
    {
      ...(uris ? { uris } : {}),
      ...(positionMs !== undefined ? { position_ms: positionMs } : {}),
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const pausePlayback = async (accessToken: string) => {
  await axios.put(
    'https://api.spotify.com/v1/me/player/pause',
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const skipToNext = async (accessToken: string) => {
  await axios.post(
    'https://api.spotify.com/v1/me/player/next',
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const skipToPrevious = async (accessToken: string) => {
  await axios.post(
    'https://api.spotify.com/v1/me/player/previous',
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const seekToPosition = async (
  accessToken: string,
  positionMs: number
) => {
  await axios.put(
    `https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const setPlaybackVolume = async (
  accessToken: string,
  volumePercent: number // 0~100 사이 값
) => {
  await axios.put(
    `https://api.spotify.com/v1/me/player/volume?volume_percent=${volumePercent}`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const addItemToQueue = async (
  accessToken: string,
  uri: string // 예: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh'
) => {
  await axios.post(
    `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(uri)}`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const getUserProfile = async (accessToken: string) => {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const searchSpotifyPlaylist = async (
  query: string,
  accessToken: string
) => {
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      q: query,
      type: 'playlist',
      limit: 10,
    },
  });
  const items = response.data.playlists?.items?.filter(Boolean) || [];

  if (items.length === 0) {
    throw new Error('해당 키워드로 유효한 플레이리스트를 찾을 수 없습니다.');
  }

  const randomIndex = Math.floor(Math.random() * items.length);
  const playlist = items[randomIndex];

  return {
    id: playlist.id,
    name: playlist.name,
    imageUrl: playlist.images?.[0]?.url || null,
    ownerId: playlist.owner?.id || null,
    ownerName: playlist.owner?.display_name || null,
  };
};

// 앨범 팔로우
export const followAlbumService = async (
  albumId: string,
  accessToken: string
) => {
  const url = `https://api.spotify.com/v1/me/albums?ids=${albumId}`;
  await axios.put(url, null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};

// 앨범 팔로우 취소
export const removeFollowAlbumService = async (
  ids: string,
  accessToken: string
) => {
  const url = `https://api.spotify.com/v1/me/albums`;

  await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      ids,
    },
  });
};

// 플레이리스트 팔로우
export const followPlaylistService = async (
  playlistId: string,
  accessToken: string
) => {
  try {
    const response = await axios.put(
      `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
      {}, // body는 비어 있음
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.status === 200 || response.status === 204;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error following playlist:',
        error.response?.data || error.message
      );
    } else {
      console.error('Error following playlist:', error);
    }
    throw error;
  }
};

// 플레이리스트 팔로우 취소
export const unfollowPlaylistService = async (
  playlistId: string,
  accessToken: string
) => {
  try {
    const response = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.status === 200 || response.status === 204;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error unfollowing playlist:',
        error.response?.data || error.message
      );
    } else {
      console.error('Error unfollowing playlist:', error);
    }
    throw error;
  }
};

// 최신 발매 앨범 가져오기
export const getNewReleasesService = async (accessToken: string) => {
  const url = `https://api.spotify.com/v1/browse/new-releases`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit: 3,
      offset: 0,
    },
  });

  const albums = response.data.albums.items.map((album: any) => ({
    id: album.id,
    image: album.images[0]?.url,
  }));

  return albums;
};

// 팔로우한 앨범 가져오기
export const getFollowedAlbumService = async (accessToken: string) => {
  const url = `https://api.spotify.com/v1/me/albums`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit: 3,
      offset: 0,
      market: 'KR',
    },
  });

  const albums = response.data.items.map((item: any) => ({
    id: item.album.id,
    image: item.album.images[0]?.url,
  }));

  return albums;
};

// 팔로우한 플레이리스트 가져오기
export const getFollowedPlayListService = async (accessToken: string) => {
  const url = `https://api.spotify.com/v1/me/playlists`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit: 3,
      offset: 0,
    },
  });

  const playlists = response.data.items.map((playlist: any) => ({
    id: playlist.id,
    image: playlist.images[0]?.url,
  }));

  return playlists;
};
