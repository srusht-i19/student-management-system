import { NextFunction, Request, Response } from 'express';

/** Functional middleware: adds basic protective HTTP headers to every response. */
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff'); // browser must not guess content types
  res.setHeader('X-Frame-Options', 'DENY'); // page cannot be shown inside an iframe
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.removeHeader('X-Powered-By'); // do not advertise "Express"
  next();
}
