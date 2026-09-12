require('dotenv').config();
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

let server;

async function startServer() {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 CODEARENA API SERVER RUNNING ON PORT ${PORT}`);
    console.log(`📡 Base URL: http://localhost:${PORT}`);
    console.log(`🛡️  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection] ${err.message}`);
  });

  // Graceful shutdown
  const handleExit = async () => {
    console.log('\n[Server] Shutting down gracefully...');
    if (server) {
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    } else {
      await disconnectDB();
      process.exit(0);
    }
  };

  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
}

startServer();
