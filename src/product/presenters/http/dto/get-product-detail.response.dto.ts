import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type, Transform } from 'class-transformer';

@Exclude()
export class GetProductDetailResponseDto {
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

  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @Expose()
  sellerThumbnailImageId: string;

  @ApiProperty({
    example: '2024-01-08T01:44:04.708Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-10T04:44:44.214Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: 15 })
  @Expose()
  @Type(() => Number)
  viewCount: number;

  @ApiProperty({ example: 10 })
  @Expose()
  likeCount: number;

  @ApiProperty({ example: true })
  @Expose()
  // 토큰이 없는 경우, 이 값은 `NULL`이므로 false 로 바꿔서 response 하기 위함
  @Transform((value) => (value.obj.isLike ? value.obj.isLike : false))
  isLike: boolean;

  @ApiProperty({ example: true })
  @Expose()
  // 토큰이 없는 경우, 이 값은 `NULL`이므로 false 로 바꿔서 response 하기 위함
  @Transform((value) => (value.obj.isPurchased ? value.obj.isPurchased : false))
  isPurchased: boolean;
}
