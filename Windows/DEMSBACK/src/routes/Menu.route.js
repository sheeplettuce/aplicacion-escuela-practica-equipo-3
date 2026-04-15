import { Router } from 'express';
import ctrl from '../controllers/Menu.controller.js';

const router = Router();

router.get('/pdf', ctrl.getMenuPDF);

export default router;