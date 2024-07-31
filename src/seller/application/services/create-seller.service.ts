import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateSellerCommand } from '@src/seller/application/commands/create-seller.command';
import { SellerRepositoryPort } from '@src/seller/application/ports/seller.repository.port';
import { SellerEntity } from '@src/seller/infra/persistence/entities/seller.entity';

@Injectable()
export class CreateSellerService {
  constructor(private readonly sellerRepository: SellerRepositoryPort) {}

  /**
   * 판매자 등록 신청
   * @param command {CreateSellerCommand}
   * @returns
   */
  async create(command: CreateSellerCommand): Promise<SellerEntity> {
    const { userId, firstName, lastName } = command;

    // 1. 판매자 등록 신청 중복 확인
    const seller = await this.sellerRepository.findOne(userId);
    if (seller) {
      throw new ForbiddenException(`Duplicate applications are not permitted.`);
    }

    // 2. Save
    const entity = SellerEntity.create({ userId, firstName, lastName });

    return this.sellerRepository.save(entity);
  }
}
