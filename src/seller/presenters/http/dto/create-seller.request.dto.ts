import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSellerRequestDto {
  @ApiProperty({ example: 'Gildong' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Kim' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
