import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductsRequestDto {
  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @IsString()
  mediaId: string;

  @ApiProperty({ example: '상품 명' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1.01 })
  @IsNumber()
  price: number;
}
