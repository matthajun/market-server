import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class FindSalesHistoriesOrderResponseDto {
  @ApiProperty({ example: '01HN2H8HKDW9BZ29RN5DKPQMV4' })
  @Expose()
  orderId: string;

  @ApiProperty({ example: '01HN2H8HKDW9BZ29RN5DKPQMV4' })
  @Expose()
  userId: string;

  @ApiProperty({ example: '2024-01-26T12:34:56.789Z' })
  @Expose()
  orderedAt: Date;

  @ApiProperty({ example: '01HN2H8HKDW9BZ29RN5DKPQMV4' })
  @Expose()
  productId: string;

  @ApiProperty({ example: '상품 명' })
  @Expose()
  productName: string;

  @ApiProperty({ example: '12.45' })
  @Expose()
  @Type(() => Number)
  price: number;
}
