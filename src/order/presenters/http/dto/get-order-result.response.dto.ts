import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { OrderStatusTypes } from '@src/order/domain/order.types';

@Exclude()
export class GetOrderResultResponseDto {
  @ApiProperty({ example: '01HN2H8HKDW9BZ29RN5DKPQMV4' })
  @Expose()
  id: string;

  @ApiProperty({ example: '01HN2H8HKDW9BZ29RN5DKPQMV4' })
  @Expose()
  userId: string;

  @ApiProperty({ example: 'success' })
  @Expose()
  status: OrderStatusTypes;

  @ApiProperty({ example: '2024-01-26T12:34:56.789Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-26T12:34:56.789Z' })
  @Expose()
  paidAt: Date;

  @ApiProperty({ example: 123.45 })
  @Expose()
  totalPrice: number;

  @ApiProperty({
    example: [
      {
        id: '01HN2HA35H1CHHVCW511P8WZM7',
        name: '상품이름',
        price: 123.45,
      },
    ],
  })
  @Expose()
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;

  @ApiProperty({ example: 'randomString' })
  @Expose()
  impUid: string;
}
