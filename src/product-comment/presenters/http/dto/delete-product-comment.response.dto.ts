import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DeleteProductCommentResponseDto {
  @ApiProperty({ example: '01HJ7ZZ6PZX6PMM0G5CM37ZT5Y' })
  @Expose()
  id: string;
}
