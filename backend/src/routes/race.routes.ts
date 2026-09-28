import { Router } from 'express';
import { getSnails, placeBet } from '../controllers/race.controller';

const router = Router();

router.get('/snails', getSnails);

router.post('/bet', placeBet);

export default router;