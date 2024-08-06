import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ProductCommentResponseDto } from '@src/product-comment/presenters/http/dto/product-comment.response.dto';

@Exclude()
export class GetProductCommentResponseDto {
  @ApiProperty({ type: ProductCommentResponseDto, isArray: true })
  @Expose()
  @Type(() => ProductCommentResponseDto)
  rows: ProductCommentResponseDto[];

  @ApiProperty({ example: 1 })
  @Expose()
  total: number;
}
