import { Router } from 'express';
import ctrl from '../controllers/Platillos.controller.js';

const router = Router();

// Rutas estáticas primero
router.get('/structure', ctrl.getStructure);
router.get('/menu', ctrl.getMenu);

router.get('/', ctrl.getAll);
router.get('/completo', ctrl.getCompleto);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;