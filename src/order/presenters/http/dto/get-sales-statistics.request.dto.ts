import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export class GetSalesStatisticsRequestDto {
  @ApiProperty({ example: '2024-02-20' })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2024-02-22' })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
