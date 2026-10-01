import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import snailpayRoutes from './routes/snailpay.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

app.use('/api/snailpay', snailpayRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});