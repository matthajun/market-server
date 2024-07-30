import { Injectable } from '@nestjs/common';
import { SellerRepositoryPort } from '@src/seller/application/ports/seller.repository.port';
import { GetSellerListQuery } from '@src/seller/application/queries/get-seller-list.query';
import { SellerEntity } from '@src/seller/infra/persistence/entities/seller.entity';

@Injectable()
export class GetSellerListService {
  constructor(private readonly sellerRepository: SellerRepositoryPort) {}

  /**
   * 판매자 신청 조회 (어드민)
   * @param query {GetSellerListQuery}
   * @returns
   */
  async findAll(query: GetSellerListQuery): Promise<[SellerEntity[], number]> {
    const { take, skip } = query;

    return this.sellerRepository.findAll(take, skip);
  }
}
