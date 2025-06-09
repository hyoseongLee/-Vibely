import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      spotifyId?: string;
      accessToken: string;
    };
  }
}
