export interface Payment {
  id: number;
  fullName: string;
  email: string;
  photo?: string;
  planCode?: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  createdAt?: string;
}
