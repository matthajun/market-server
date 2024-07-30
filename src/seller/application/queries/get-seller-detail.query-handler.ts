import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SellerRepositoryPort } from '@src/seller/application/ports/seller.repository.port';
import { GetSellerDetailQuery } from '@src/seller/application/queries/get-seller-detail.query';
import { SellerEntity } from '@src/seller/infra/persistence/entities/seller.entity';

@QueryHandler(GetSellerDetailQuery)
export class GetSellerDetailQueryHandler
  implements IQueryHandler<GetSellerDetailQuery>
{
  constructor(private readonly sellerRepository: SellerRepositoryPort) {}

  /**
   * 허가 된 판매자인지 조회하는 이벤트 핸들러
   * @param query
   * @returns
   */
  execute(query: GetSellerDetailQuery): Promise<SellerEntity> {
    const { sellerId } = query;
    return this.sellerRepository.findOneApproved(sellerId);
  }
}
