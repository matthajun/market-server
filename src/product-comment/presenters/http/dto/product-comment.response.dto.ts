import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductCommentResponseDto {
  @ApiProperty({ example: '01HJ7ZZ6PZX6PMM0G5CM37ZT5Y' })
  @Expose()
  id: string;

  @ApiProperty({ example: '01HJ8435N3FXGRXA8FX34DA4QV' })
  @Expose()
  userId: string;

  @ApiProperty({ example: '댓글 내용 입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '01HJ8435N3FXGRXA8FX34DA4QV' })
  @Expose()
  authorProfileImageMediaId: string;

  @ApiProperty({ example: '2023-12-22T12:34:56.789Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-12-22T12:34:56.789Z' })
  @Expose()
  updatedAt: Date;
}
