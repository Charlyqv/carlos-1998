import { Router } from 'express';
import { processRecharge } from '../controllers/snailpay.controller';

const router = Router();

router.post('/recharge', processRecharge);

export default router;