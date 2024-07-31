import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ProductResponseDto {
  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @Expose()
  id: string;

  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @Expose()
  mediaId: string;

  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @Expose()
  userId: string;

  @ApiProperty({ example: '상품 명' })
  @Expose()
  name: string;

  @ApiProperty({ example: 1.01 })
  @Expose()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: '2024-01-08T01:44:04.708Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: 15 })
  @Expose()
  @Type(() => Number)
  viewCount: number;
}

@Exclude()
export class GetProductListResponseDto {
  @ApiProperty({ type: ProductResponseDto, isArray: true })
  @Type(() => ProductResponseDto)
  @Expose()
  rows: ProductResponseDto[];

  @ApiProperty({ example: 10 })
  @Expose()
  total: number;
}
