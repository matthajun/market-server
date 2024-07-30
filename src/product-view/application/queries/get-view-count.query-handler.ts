import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductViewEntity } from '@src/product-view/infra/persistence/entities/product-view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetViewCountQuery } from './get-view-count.query';

@QueryHandler(GetViewCountQuery)
export class GetViewCountQueryHandler
  implements IQueryHandler<GetViewCountQuery>
{
  constructor(
    @InjectRepository(ProductViewEntity)
    private readonly repository: Repository<ProductViewEntity>,
  ) {}

  /**
   * 상품 조회수 리턴
   * @param query {GetViewCountQuery}
   * @returns
   */
  async execute(query: GetViewCountQuery): Promise<number> {
    const { productId } = query;

    return this.repository.count({ where: { productId } });
  }
}
