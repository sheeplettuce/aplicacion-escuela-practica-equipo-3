import express from 'express';
import { enviarRecordatorios, enviarTicket } from '../controllers/Recordatorio.controller.js';

const router = express.Router();

router.post('/enviarRecordatorios', enviarRecordatorios);
router.get('/ticket/:id', enviarTicket); 
export default router;