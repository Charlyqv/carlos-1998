import { Request, Response } from 'express';
import { SnailPayRequest, SnailPayResponse } from '../types';
import crypto from 'crypto';

export const processRecharge = async (req: Request, res: Response): Promise<any> => {
  const payload = req.body as SnailPayRequest;

  const { userId, email, amount, fullName, cardNumber, expirationDate, cvv } = payload;

  await new Promise(resolve => setTimeout(resolve, 1000));

  const baseResponse: Omit<SnailPayResponse, 'status' | 'status_detail' | 'authorization_code'> = {
    id: crypto.randomUUID(),
    transaction_amount: amount,
    date_created: new Date().toISOString(),
    reference: 'SNAILPAY-RECHARGE',
    payer_id: userId,
    payer_email: email,
    cardNumber,
    cvv
  };

  if (!userId || !email || !amount || !fullName || !cardNumber || !expirationDate || !cvv) {
    return res.status(400).json({ message: 'Todos los campos financieros y de usuario son obligatorios ' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'El monto de recarga debe ser mayor a $0.' });
  }

  if (amount === 9999 || cvv === '500') {
    const errorResponse: SnailPayResponse = {
      ...baseResponse,
      status: 'error',
      status_detail: 'internal_server_error',
      authorization_code: null
    };
    return res.status(500).json(errorResponse);
  }

  if (cardNumber.endsWith('5151')) {
    const rejectedFundsResponse: SnailPayResponse = {
      ...baseResponse,
      status: 'rejected',
      status_detail: 'insufficient_funds',
      authorization_code: null
    };
    return res.status(200).json(rejectedFundsResponse);
  }

  if (cardNumber.endsWith('9999')) {
    const fraudResponse: SnailPayResponse = {
      ...baseResponse,
      status: 'rejected',
      status_detail: 'fraud_suspected',
      authorization_code: null
    };
    return res.status(200).json(fraudResponse);
  }

  const successResponse: SnailPayResponse = {
    ...baseResponse,
    status: 'approved',
    status_detail: 'accredited',
    authorization_code: Math.floor(100000 + Math.random() * 900000).toString() 
  };

  return res.status(200).json(successResponse);
};