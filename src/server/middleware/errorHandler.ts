import { Request, Response, NextFunction } from 'express';

// In Express error handlers, you often need the req, next parameters even if you don’t use them. 
export const errorHandler = (
  err: Error,
  _req: Request, // To silence TypeScript, prefix them with _
  res: Response,
  _next: NextFunction // To silence TypeScript, prefix them with _
) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error'
  });
};