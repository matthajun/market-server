import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetProductListRequestDto {
  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  sellerId?: string;

  @ApiProperty({ example: 10, required: false })
  @Min(1)
  @IsInt()
  @IsOptional()
  take?: number;

  @ApiProperty({ example: 0, required: false })
  @Min(0)
  @IsInt()
  @IsOptional()
  skip?: number;
}
