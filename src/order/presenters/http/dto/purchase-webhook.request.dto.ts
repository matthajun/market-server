import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PurchaseWebhookRequestDto {
  @ApiProperty({ example: 'MERCHANT_UID' })
  @IsString()
  merchant_uid: string;

  @ApiProperty({ example: 'IMP_UID' })
  @IsString()
  imp_uid: string;

  @ApiProperty({ example: 'paid' })
  @IsString()
  status: string;
}
