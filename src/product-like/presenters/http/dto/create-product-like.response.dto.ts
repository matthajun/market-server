import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateProductLikeResponseDto {
  @ApiProperty({ example: '01HJ7ZZ6PZX6PMM0G5CM37ZT5Y' })
  @Expose()
  userId: string;

  @ApiProperty({ example: '01HJ7ZZ6PZX6PMM0G5CM37ZT5Y' })
  @Expose()
  productId: string;

  @ApiProperty({ example: `'like' | 'none'` })
  @Expose()
  status: string;

  @ApiProperty({ example: '2024-12-22T12:34:56.789Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-12-22T12:34:56.789Z' })
  @Expose()
  updatedAt: Date;
}
