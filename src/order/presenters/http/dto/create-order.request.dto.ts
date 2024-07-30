import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty({
    example: ['01HMZW5VDDRKMRC0XR8WP7PV0A', '01HMZW60CHY4G1982YPVQMQ73M'],
    isArray: true,
  })
  @IsString({ each: true })
  productIds: string[];
}
