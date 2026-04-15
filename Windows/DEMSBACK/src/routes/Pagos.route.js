import { Router } from 'express';
import ctrl from '../controllers/Pagos.controller.js';

const router = Router();

// Rutas
router.get('/pedido/:idPedido', ctrl.getByPedido);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.post('/enviar-ticket', ctrl.enviarTicket);
router.post('/imprimir-ticket', ctrl.imprimirTicket);

export default router;