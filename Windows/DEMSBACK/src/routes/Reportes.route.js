import { Router } from 'express';
import ctrl from '../controllers/Reportes.controller.js';

const router = Router();

router.get('/resumen', ctrl.getResumen);
router.get('/historial-cambios', ctrl.getHistorialCambios);

export default router;