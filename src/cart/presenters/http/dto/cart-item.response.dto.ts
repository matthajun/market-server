import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CartItemResponseDto {
  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @Expose()
  productId: string;

  @ApiProperty({ example: '상품명' })
  @Expose()
  name: string;

  @ApiProperty({ example: 10.12 })
  @Expose()
  price: number;

  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @Expose()
  productThumbnailImage: string;
}
