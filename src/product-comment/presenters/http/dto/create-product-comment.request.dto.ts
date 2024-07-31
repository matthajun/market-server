import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductCommentRequestDto {
  @ApiProperty({ example: '댓글 내용 입니다.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
