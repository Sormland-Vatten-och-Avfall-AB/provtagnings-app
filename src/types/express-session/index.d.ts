// src/types/express-session/index.d.ts
import 'express-session';

declare module 'express-session' {
  interface Session {
    loggedIn?: boolean;
    username?: string;
  }
}