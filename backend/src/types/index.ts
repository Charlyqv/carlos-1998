export interface SnailPayRequest {
  userId: string;
  email: string;
  amount: number;
  fullName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}