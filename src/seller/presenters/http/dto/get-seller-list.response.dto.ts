import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { SellerResponseDto } from '@src/seller/presenters/http/dto/seller.response.dto';

@Exclude()
export class GetSellerListResponseDto {
  @ApiProperty({ type: SellerResponseDto, isArray: true })
  @Expose()
  @Type(() => SellerResponseDto)
  rows: SellerResponseDto[];

  @ApiProperty({ example: 1 })
  @Expose()
  total: number;
}
