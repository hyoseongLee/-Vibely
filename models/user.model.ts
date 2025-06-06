import pool from '../database/mariadb';

export const upsertUserToken = async (params: {
  spotifyId: string;
  accessToken: string;
  refreshToken: string;
}) => {
  const { spotifyId, accessToken, refreshToken } = params;

  await pool.query(
    `INSERT INTO users (spotifyId, accessToken, refreshToken)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
    accessToken = VALUES(accessToken),
    refreshToken = VALUES(refreshToken)`,
    [spotifyId, accessToken, refreshToken]
  );
};
