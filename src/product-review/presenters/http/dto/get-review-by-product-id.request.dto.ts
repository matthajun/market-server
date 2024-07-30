import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetReviewByProductIdRequestDto {
  @ApiProperty({ example: 10 })
  @Min(1)
  @IsInt()
  @IsOptional()
  take?: number;

  @ApiProperty({ example: 0 })
  @Min(0)
  @IsInt()
  @IsOptional()
  skip?: number;
}
