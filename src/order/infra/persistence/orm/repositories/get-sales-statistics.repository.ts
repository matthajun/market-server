import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesHistoryReadModelEntity } from '@src/order/infra/persistence/orm/entities/sales-history-read-model.entity';
import { Injectable } from '@nestjs/common';
import { GetSalesStatisticsRepositoryPort } from '@src/order/application/ports/get-sales-statistics.repository.port';
import { ProductViewEntity } from '@src/product-view/infra/persistence/entities/product-view.entity';
import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';
import { ProductDownloadHistoryEntity } from '@src/product/infra/persistence/entities/product-download-history.entity';
import { SalesStatisticsTrend } from '@src/order/domain/statistics/sales-statistics-trend';
import { SalesStatistics } from '@src/order/domain/statistics/sales-statistics';

@Injectable()
export class GetSalesStatisticsRepository
  implements GetSalesStatisticsRepositoryPort
{
  constructor(
    @InjectRepository(SalesHistoryReadModelEntity)
    private readonly repository: Repository<SalesHistoryReadModelEntity>,
  ) {}

  /**
   * 통계 데이터 조회
   * @param sellerId
   * @param startDate
   * @param endDate
   * @return
   */
  async getStatistics({
    sellerId,
    startDate,
    endDate,
  }): Promise<SalesStatistics> {
    const queryBuilder = this.repository.createQueryBuilder(
      'sales_history_read_model',
    );

    const selectQueryBuilder = queryBuilder
      .select([`id`])
      // totalSales, 총 수입
      .addSelect((qb) => {
        return (
          qb
            // 값이 `NULL`일 경우 0 을 리턴하기 위해 `coalesce` 함수 사용
            .select(`coalesce(sum(price), 0)`, `totalSales`)
            .from(SalesHistoryReadModelEntity, `s`)
            .where(`"createdAt" BETWEEN :startDate and :endDate`, {
              startDate,
              // API 에서 date 를 날짜 까지(YYYY-MM-DD)만 입력 받기 때문에
              // `where between` SQL 문에 넣으려면 endDate 에 +1day 만큼 보정 해주어야 함
              endDate: this.toTomorrow(endDate),
            })
            .andWhere(`"sellerId" = :sellerId`, { sellerId })
        );
      })
      // salesThisMonth, 이번 달 매출
      .addSelect((qb) => {
        return qb
          .select(`coalesce(sum(price), 0)`, `salesThisMonth`)
          .from(SalesHistoryReadModelEntity, `s`)
          .where(
            `to_char(:startDate, 'YYYY-MM') like concat(to_char(now(), 'YYYY-MM'),'%')`,
            {
              startDate,
            },
          )
          .andWhere(`"sellerId" = :sellerId`, { sellerId });
      })
      // totalViews, 총 조회 수
      .addSelect((qb) => {
        return qb
          .select(`count(*)`, `totalViews`)
          .from(ProductViewEntity, `p`)
          .where(
            `"productId" in` +
              queryBuilder
                .subQuery()
                .select([`id`])
                .from(ProductEntity, 'p')
                .where(`"userId" = :sellerId`, { sellerId })
                .getQuery(),
          )
          .andWhere(`"createdAt" BETWEEN :startDate and :endDate`, {
            startDate,
            endDate: this.toTomorrow(endDate),
          });
      })
      // totalDownloads, 총 다운로드 수
      .addSelect((qb) => {
        return qb
          .select(`count(*)`, `totalDownloads`)
          .from(ProductDownloadHistoryEntity, `p`)
          .where(
            `"productId" in` +
              queryBuilder
                .subQuery()
                .select([`id`])
                .from(ProductEntity, 'p')
                .where(`"userId" = :sellerId`, { sellerId })
                .getQuery(),
          )
          .andWhere(`"createdAt" BETWEEN :startDate and :endDate`, {
            startDate,
            endDate: this.toTomorrow(endDate),
          });
      });

    const statisticsResult = await selectQueryBuilder.getRawOne();

    // TypeORM 에서 `outer-join`을 지원하지 않아 rawQuery 로 실행
    const query = this.getProductTrendQuery({ sellerId, startDate, endDate });
    const queryResults = await this.repository.query(query);

    const productTrends = queryResults.map(
      (queryResult: { views: number; downloads: number; date: Date }) =>
        new SalesStatisticsTrend(
          queryResult.views,
          queryResult.downloads,
          queryResult.date,
        ),
    );

    const result = new SalesStatistics(
      statisticsResult.totalSales,
      statisticsResult.salesThisMonth,
      statisticsResult.totalViews,
      statisticsResult.totalDownloads,
      productTrends,
    );

    return result;
  }

  /**
   * Date 변수를 `rawQuery`로 실행할 SQL 문에 넣기 위해
   * `YYYY-MM-DD` 형식의 string 타입으로 변경해주는 함수
   * @param date
   * @return
   */
  private fromDateToString(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  /**
   * API 에서 date 를 날짜 까지(YYYY-MM-DD)만 입력 받기 때문에
   * `where between` SQL 문에 넣으려면 endDate 에 +1day 만큼 보정 해주어야 함
   * @param date
   * @returns
   */
  private toTomorrow(date: Date): Date {
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);

    return tomorrow;
  }

  /**
   * `productTrend`를 조회하기 위한 쿼리
   * @param sellerId
   * @param startDate
   * @param endDate
   * @returns
   */
  private getProductTrendQuery({ sellerId, startDate, endDate }): string {
    return `
    SELECT coalesce(view_table.date, download_table.date) AS date,
        coalesce(view_table.view, 0) AS views,
        coalesce(download_table.download, 0) AS downloads 
      FROM
      (
	      SELECT to_char("createdAt", 'YYYY-MM-DD') AS date,
	        count(*) AS view 
	      FROM product_view
          WHERE "productId" IN (SELECT id FROM product WHERE "userId" = '${sellerId}')
            AND to_char("createdAt", 'YYYY-MM-DD') 
              BETWEEN 
                '${this.fromDateToString(startDate)}' 
              and '${this.fromDateToString(endDate)}'
          GROUP BY to_char("createdAt", 'YYYY-MM-DD')
      ) AS view_table FULL OUTER JOIN
      (
	      SELECT to_char("createdAt", 'YYYY-MM-DD') AS date,
	        count(*) AS download 
	      FROM product_download_history
          WHERE "productId" IN (SELECT id FROM product WHERE "userId" = '${sellerId}')
            AND to_char("createdAt", 'YYYY-MM-DD') 
              BETWEEN 
                '${this.fromDateToString(startDate)}' 
              and '${this.fromDateToString(endDate)}'
          GROUP BY to_char("createdAt", 'YYYY-MM-DD')
      ) AS download_table ON view_table.date = download_table.date
    `;
  }
}
