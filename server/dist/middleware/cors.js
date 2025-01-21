import cors from 'cors';
export const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
};
export default cors(corsOptions);
//# sourceMappingURL=cors.js.map