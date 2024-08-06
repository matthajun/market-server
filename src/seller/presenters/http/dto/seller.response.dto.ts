import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { SellerStatusTypes } from '@src/seller/infra/persistence/entities/seller-status.types';

@Exclude()
export class SellerResponseDto {
  @ApiProperty({ example: '01HJ7ZZ6PZX6PMM0G5CM37ZT5Y' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Gildong' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Kim' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: 'pending | approved | rejected' })
  @Expose()
  status: SellerStatusTypes;

  @ApiProperty({ example: '2023-12-22T12:34:56.789Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-12-22T12:34:56.789Z' })
  @Expose()
  updatedAt: Date;
}
