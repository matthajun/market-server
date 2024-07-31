import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetSalesStatisticsProductTrend {
  @ApiProperty({ example: 120 })
  @Expose()
  @Type(() => Number)
  views: number;

  @ApiProperty({ example: 23 })
  @Expose()
  @Type(() => Number)
  downloads: number;

  @ApiProperty({ example: '2022-02-14' })
  @Expose()
  date: Date;
}

@Exclude()
export class GetSalesStatisticsResponseDto {
  @ApiProperty({ example: 12.56 })
  @Expose()
  @Type(() => Number)
  totalSales: number;

  @ApiProperty({ example: 34.56 })
  @Expose()
  @Type(() => Number)
  salesThisMonth: number;

  @ApiProperty({ example: 120 })
  @Expose()
  @Type(() => Number)
  totalViews: number;

  @ApiProperty({ example: 23 })
  @Expose()
  @Type(() => Number)
  totalDownloads: number;

  @ApiProperty({ type: GetSalesStatisticsProductTrend, isArray: true })
  @Expose()
  @Type(() => GetSalesStatisticsProductTrend)
  productTrends: GetSalesStatisticsProductTrend[];
}
