import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import sseRoutes from './routes/sse.route.js';

app.use('/sse', sseRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor DEMS! corriendo en http://localhost:${PORT}`);
});