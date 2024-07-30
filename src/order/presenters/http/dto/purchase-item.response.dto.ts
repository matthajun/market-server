import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class PurchaseItemResponseDto {
  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @Expose()
  productId: string;

  @ApiProperty({ example: '상품명' })
  @Expose({ name: 'name' })
  title: string;

  @ApiProperty({ type: Number })
  @Expose({ name: 'price' })
  @Transform((value) => value.obj.price.value)
  price: number;
}
