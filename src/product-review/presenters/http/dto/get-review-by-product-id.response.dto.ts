import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ProductReviewResponseDto } from './product-review.response.dto';

@Exclude()
export class GetReviewByProductIdResponseDto {
  @ApiProperty({ type: ProductReviewResponseDto, isArray: true })
  @Expose()
  @Type(() => ProductReviewResponseDto)
  rows: ProductReviewResponseDto[];

  @ApiProperty({ example: 1 })
  @Expose()
  total: number;
}
