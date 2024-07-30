import { OrderStatusTypes } from '../order.types';

export class OrderResult {
  id: string;
  userId: string;
  status: OrderStatusTypes;
  createdAt: Date;
  paidAt: Date;
  totalPrice: number;
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  impUid: string;
}
