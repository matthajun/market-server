import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetReviewByUserIdResponseDto {
  @ApiProperty({ example: '01HJ7ZZ6PZX6PMM0G5CM37ZT5Y' })
  @Expose()
  id: string;

  @ApiProperty({ example: '리뷰 내용 입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2.5' })
  @Expose()
  @Type(() => Number)
  starRating: number;

  @ApiProperty({ example: '01HJ8435N3FXGRXA8FX34DA4QV' })
  @Expose()
  authorProfileImageMediaId: string;

  @ApiProperty({ example: '2023-12-22T12:34:56.789Z' })
  @Expose()
  createdAt: Date;
}
