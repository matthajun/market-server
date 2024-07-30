import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductReviewRequestDto {
  @ApiProperty({ example: '상품 리뷰 내용 입니다.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '1.5' })
  @IsNumber()
  @IsNotEmpty()
  starRating: number;
}
