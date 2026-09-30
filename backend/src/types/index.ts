export interface SnailPayRequest {
  userId: string;
  email: string;
  amount: number;
  fullName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

export interface SnailPayResponse {
  id: string;
  status: 'approved' | 'rejected' | 'error'; 
  status_detail: 'accredited' | 'insufficient_funds' | 'fraud_suspected' | 'internal_server_error'; 
  transaction_amount: number;
  date_created: string;
  authorization_code: string | null; // null si la transacción falla
  reference: string;
  payer_id: string;
  payer_email: string;
  cardNumber: string;
  cvv: string;
}