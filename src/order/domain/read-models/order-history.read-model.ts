import { OrderStatusTypes } from '../order.types';

export class OrderHistoryReadModel {
  id: string;
  userId: string;
  status: OrderStatusTypes;
  orderedAt?: Date;
  totalPrice?: number;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    thumbnailImageId: string;
  }>;
  // 결제 사전검증시에는 imp uid 없음
  impUid?: string;
}
