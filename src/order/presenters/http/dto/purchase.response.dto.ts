import { ApiProperty } from '@nestjs/swagger';
import { PurchaseItemResponseDto } from './purchase-item.response.dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
export class PurchaseResponseDto {
  @ApiProperty({ example: 'ORDER_ID' })
  @Expose()
  id: string;

  @ApiProperty({ type: PurchaseItemResponseDto, isArray: true })
  @Expose()
  @Type(() => PurchaseItemResponseDto)
  items: PurchaseItemResponseDto[];

  @ApiProperty({ example: '2024-02-21T02:06:40.080Z' })
  @Expose()
  @Transform((value) => value.obj.createdAt)
  orderedAt: Date;
}
