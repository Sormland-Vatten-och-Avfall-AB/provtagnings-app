import { Request, Response, NextFunction } from 'express';

// Properly extend the session
interface CustomSession {
  loggedIn?: boolean;
  username?: string;
}

// Authentication middleware
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Access session using req.session and cast correctly
  const session = req.session as any;
  
  if (session && session.loggedIn) {
    // User is authenticated, proceed to next middleware
    return next();
  }
  
  // User is not authenticated, redirect to login page
  res.redirect('/admin');
};