import express from 'express';
import bodyParser from 'body-parser';
import cors from './middleware/cors';
import './db/connection.js';
// import authRoutes from './routes/auth';
// import chatRoutes from './routes/chats';
const app = express();
app.use(bodyParser.json());
app.use(cors);
// Test Route
app.get('/api/test', async (req, res) => {
    res.status(200).send({ success: true, message: 'Server is running!' });
});
// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/chats', chatRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[App]: Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map