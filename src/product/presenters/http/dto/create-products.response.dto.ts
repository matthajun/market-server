import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateProductsResponseDto {
  @ApiProperty({ example: '01H04ABH1XW3Q2SRVM5CE0EW6V' })
  @Expose()
  id: string;

  @ApiProperty({ example: '01H04ABH1XW3Q2SRVM5CE0EW6V' })
  @Expose()
  mediaId: string;

  @ApiProperty({ example: '01H04ABH1XW3Q2SRVM5CE0EW6V' })
  @Expose()
  userId: string;

  @ApiProperty({ example: '상품 명' })
  @Expose()
  name: string;

  @ApiProperty({ example: 1.01 })
  @Expose()
  price: number;

  @ApiProperty({ example: '01H04ABH1XW3Q2SRVM5CE0EW6V' })
  @Expose()
  sellerThumbnailImageId: string;

  @ApiProperty({
    example: '2024-01-08T01:44:04.708Z',
  })
  @Expose()
  createdAt: Date;
}
