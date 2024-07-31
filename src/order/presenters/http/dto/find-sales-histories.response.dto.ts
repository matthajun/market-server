import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FindSalesHistoriesOrderResponseDto } from './find-sales-histories.order.response.dto';
import { plainToInstance } from 'class-transformer';
import { SalesHistoryReadModelEntity } from '@src/order/infra/persistence/orm/entities/sales-history-read-model.entity';

@Exclude()
export class FindSalesHistoriesResponseDto {
  @ApiProperty({ example: '01HN2H8HKDW9BZ29RN5DKPQMV4' })
  @Expose()
  id: string;

  @ApiProperty({ example: '01HN2H8HKDW9BZ29RN5DKPQMV4' })
  @Expose()
  sellerId: string;

  @ApiProperty({ type: FindSalesHistoriesOrderResponseDto })
  @Expose()
  @Type(() => FindSalesHistoriesOrderResponseDto)
  order: FindSalesHistoriesResponseDto;

  @ApiProperty({ example: '2024-01-26T12:34:56.789Z' })
  @Expose()
  createdAt: Date;

  /**
   * readModelEntity 를 responseDTO 로 변환하여 return
   * @param entities {SalesHistoryReadModelEntity[]}
   * @returns
   */
  static fromReadModelEntity(
    entities: SalesHistoryReadModelEntity[],
  ): FindSalesHistoriesResponseDto[] {
    const data = entities.map((entity) => {
      return {
        id: entity.id,
        sellerId: entity.sellerId,
        order: {
          orderId: entity.content.orderId,
          userId: entity.content.userId,
          orderedAt: entity.content.orderedAt,
          productId: entity.content.productId,
          productName: entity.content.productName,
          price: entity.content.price,
        },
        createdAt: entity.createdAt,
      };
    });

    return plainToInstance(FindSalesHistoriesResponseDto, data);
  }
}
