import 'dotenv/config';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import app from './app.js';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.info(`🚀 Voyai API listening on http://localhost:${env.PORT}`);
    console.info(`   Environment : ${env.NODE_ENV}`);
    console.info(`   LLM Model   : ${env.LLM_MODEL}`);
  });

  const gracefulShutdown = async (signal: string): Promise<void> => {
    console.info(`\n🛑 Received ${signal}. Shutting down gracefully…`);

    server.close(async (err) => {
      if (err) {
        console.error('Error closing HTTP server:', err);
        process.exit(1);
      }

      await disconnectDatabase();
      console.info('✅ Server shut down cleanly');
      process.exit(0);
    });

    // Force-exit if the server hasn't closed within 10s (e.g. keep-alive connections stuck open).
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('💥 Unhandled Promise Rejection:', reason);
    void gracefulShutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    void gracefulShutdown('uncaughtException');
  });
}

void bootstrap();
