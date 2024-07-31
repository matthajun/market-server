import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductViewEntity } from '@src/product-view/infra/persistence/entities/product-view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductViewCommand } from './create-product-view.command';

@QueryHandler(CreateProductViewCommand)
export class CreateProductViewCommandHandler
  implements IQueryHandler<CreateProductViewCommand>
{
  constructor(
    @InjectRepository(ProductViewEntity)
    private readonly repository: Repository<ProductViewEntity>,
  ) {}

  private readonly logger: Logger = new Logger(
    CreateProductViewCommandHandler.name,
  );

  /**
   * ProductView 저장
   * @param command {CreateProductViewCommand}
   */
  async execute(command: CreateProductViewCommand): Promise<void> {
    const { productId, userId } = command;

    // 1. 최근 뷰 조회
    const result = await this.repository.findOne({
      where: {
        productId,
        userId,
      },
      order: {
        createdAt: 'desc',
      },
    });

    // 2.a. 최근 뷰가 있고,
    // 지난 시간이 30분 이내면 뷰 카운트를 up 하지 않는다. (임시 정책)
    if (result && result.getTimeDiff() < 30) {
      this.logger.debug(
        `This user has viewed product above 30 minutes. timeDiff: ${result
          .getTimeDiff()
          .toFixed(2)}minutes`,
      );
      return;
    }

    // 2.b. View count up
    const entity = ProductViewEntity.create(productId, userId);
    await this.repository.save(entity);

    this.logger.debug(`View count up complete.`);
  }
}
