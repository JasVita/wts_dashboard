// If you have a config/env file for environment variables:
/// import { env } from './config/env';
// If your db/connection.ts automatically logs "Successfully connected" on success,
// there's no need to import anything else to test the connection. 
// But you could import if you want to do test queries here:
// import { pool } from './db/connection';
// import { customerStatsRouter } from './routes/customerStats';
// import { customerChatsRouter } from './routes/customerChats';
// import { messagesRouter } from './routes/messages';
// import { chatStatusRouter } from './routes/chatStatus';
// import { pushHumanRouter } from './routes/pushHumanRouter';
// import { initSocketIO } from './socket';
import './db/connection.js'; // ensures DB connection is initiated
import { listAllTables, listAllTableColumns } from './db/getFromDB.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import.meta.url;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));
app.use(express.json());
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));
// Optional test endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running, DB should log connection status in console.',
    });
});
const server = createServer(app);
const PORT = 5000;
server.listen(PORT, async () => {
    console.log(`[Index]: Server running on port ${PORT}`);
    // 1) List all table names
    try {
        const tables = await listAllTables();
        console.log('[Index]: Tables in DB =>', tables);
        // tables is an array of objects, e.g. [{ tablename: 'users' }, { tablename: 'orders' }]
    }
    catch (err) {
        console.error('[Index]: Error listing tables =>', err);
    }
    // 2) List columns and data types for each table in the public schema
    try {
        const columns = await listAllTableColumns();
        console.log('[Index]: Table columns =>', columns);
    }
    catch (err) {
        console.error('[Index]: Error listing columns =>', err);
    }
});
// ===== COMMENTED OUT ROUTES =====
// app.use('/api/stats', customerStatsRouter);
// app.use('/api', customerChatsRouter);
// app.use('/api', messagesRouter);
// app.use('/api', chatStatusRouter);
// app.use('/api', pushHumanRouter);
// Comment out fallback route if not needed
// app.get('*', (_req, res) => {
//   res.sendFile(path.join(distPath, 'index.html'));
// });
// console.log('[Server] HTTP server created');
// If you’re using Socket.IO, comment it out for now
// const io = initSocketIO(server);
// console.log('[Server] Socket.IO server initialized');
// io.on('connection', (socket) => {
//   console.log('New Socket.IO client connected:', socket.id);
// });
// io.engine.on('connection_error', (err) => {
//   console.log('[Socket] Connection error:', err);
// });
//# sourceMappingURL=index.js.map