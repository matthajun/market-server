import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetSellerResultQuery } from '@src/seller/application/queries/get-seller-result.query';
import { SellerRepositoryPort } from '@src/seller/application/ports/seller.repository.port';
import { SellerEntity } from '@src/seller/infra/persistence/entities/seller.entity';

@Injectable()
export class GetSellerResultService {
  constructor(private readonly sellerRepository: SellerRepositoryPort) {}

  /**
   * 판매자 신청 결과 조회
   * @param query {GetSellerResultQuery}
   * @returns
   */
  async findOne(query: GetSellerResultQuery): Promise<SellerEntity> {
    const { userId } = query;

    const seller = await this.sellerRepository.findOne(userId);
    if (!seller) {
      throw new ForbiddenException(`Please apply seller-request first.`);
    }

    return seller;
  }
}
