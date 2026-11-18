import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

export const createApp = (): Application => {
  const app = express();

  // Allow cross-origin requests with credentials (cookies / Authorization header)
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Parse incoming JSON and URL-encoded request bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files (avatars) as static files under /uploads
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Health check endpoint to verify the backend is alive
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'transcendence-backend',
      timestamp: new Date().toISOString()
    });
  });

  return app;
};
