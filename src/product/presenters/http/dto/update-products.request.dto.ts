import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductsRequestDto {
  @ApiProperty({ example: '수정 할 상품명' })
  @IsString()
  name: string;

  @ApiProperty({ example: 10.11 })
  @IsNumber()
  price: number;
}
