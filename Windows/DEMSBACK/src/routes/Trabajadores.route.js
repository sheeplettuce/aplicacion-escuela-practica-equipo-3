import { Router } from 'express';
import ctrl from '../controllers/Trabajadores.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// rutas públicas (sin token)
router.get('/structure', ctrl.getStructure);
router.post('/login', ctrl.login);

// rutas protegidas (con token)
router.get('/', verifyToken, ctrl.getAll);
router.get('/:id', verifyToken, ctrl.getById);
router.post('/', verifyToken, ctrl.create);
router.put('/:id', verifyToken, ctrl.update);
router.delete('/:id', verifyToken, ctrl.remove);

export default router;