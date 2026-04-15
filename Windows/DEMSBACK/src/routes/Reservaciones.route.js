import { Router } from 'express';
import ctrl from '../controllers/Reservaciones.controller.js';

const router = Router();

// Rutas estáticas primero para evitar conflicto con /:id
router.get('/proximas', ctrl.getProximas);

router.get('/',       ctrl.getAll);
router.get('/:id',    ctrl.getById);
router.post('/',      ctrl.create);
router.put('/:id',    ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;