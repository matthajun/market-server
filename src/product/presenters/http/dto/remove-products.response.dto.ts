import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RemoveProductsResponseDto {
  @ApiProperty({ example: '01H04ABH1XW3Q2SRVM5CE0EW6V' })
  @Expose()
  id: string;
}
