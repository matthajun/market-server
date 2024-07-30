import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PurchaseRequestDto {
  @ApiProperty({ example: 'MERCHANT_UID' })
  @IsString()
  merchantUid: string;

  @ApiProperty({ example: 'IMP_UID' })
  @IsString()
  impUid: string;
}
