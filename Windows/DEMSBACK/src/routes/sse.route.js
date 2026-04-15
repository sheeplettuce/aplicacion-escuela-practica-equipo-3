// routes/sse.routes.js
import { Router } from 'express';

const router = Router();

let clients = [];

router.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        res
    };

    clients.push(newClient);

    console.log('Cliente conectado SSE:', clientId);

    req.on('close', () => {
        console.log('Cliente desconectado:', clientId);
        clients = clients.filter(c => c.id !== clientId);
    });
});

export const sendEventToAll = (event, data) => {
    clients.forEach(client => {
        client.res.write(`event: ${event}\n`);
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};

export default router;