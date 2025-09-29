import type { IronSessionOptions } from 'iron-session';
import type { SiweMessage } from 'siwe';

export type SessionData = {
  nonce?: string;
  siwe?: SiweMessage;
  isLoggedIn: boolean;
};

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'meritbase-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
