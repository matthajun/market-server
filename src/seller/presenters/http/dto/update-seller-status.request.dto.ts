import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SellerStatusTypes } from '@src/seller/infra/persistence/entities/seller-status.types';

export class UpdateSellerStatusRequestDto {
  @ApiProperty({ example: 'approved' })
  @IsEnum(SellerStatusTypes)
  @IsNotEmpty()
  status: SellerStatusTypes;
}
