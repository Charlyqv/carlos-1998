import { Request, Response } from 'express';
import { SnailPayRequest } from '../types';
import crypto from 'crypto';

export const processRecharge = async (req: Request, res: Response): Promise<any> => {
  const payload = req.body as SnailPayRequest;

  const { userId, email, amount, fullName, cardNumber, expirationDate, cvv } = payload;
  
  if (!userId || !email || !amount || !fullName || !cardNumber || !expirationDate || !cvv) {
    return res.status(400).json({ message: 'Todos los campos financieros y de usuario son obligatorios ' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'El monto de recarga debe ser mayor a $0.' });
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  if (cardNumber === '0000000000000000') {
    return res.status(400).json({ message: 'Tarjeta rechazada por fraude.' });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Recarga aprobada por SnailPay',
    transactionId: crypto.randomUUID(),
    processedAmount: amount
  });
};