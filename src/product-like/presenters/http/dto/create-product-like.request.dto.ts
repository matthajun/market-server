import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductLikeRequestDto {
  @ApiProperty({ example: '01HMQH8KGZVM9EKR4J5CBBG0Q2' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
