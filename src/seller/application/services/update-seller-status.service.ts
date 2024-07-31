import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSellerStatusCommand } from '@src/seller/application/commands/update-seller-status.command';
import { SellerRepositoryPort } from '@src/seller/application/ports/seller.repository.port';
import { SellerEntity } from '@src/seller/infra/persistence/entities/seller.entity';

@Injectable()
export class UpdateSellerStatusService {
  constructor(private readonly sellerRepository: SellerRepositoryPort) {}

  /**
   * 판매자 신청 상태 업데이트 (어드민)
   * @param command {UpdateSellerStatusCommand}
   * @returns
   */
  async updateStatus(
    command: UpdateSellerStatusCommand,
  ): Promise<SellerEntity> {
    const { sellerId, status } = command;

    // 1. 판매자 신청 조회
    const seller = await this.sellerRepository.findOne(sellerId);
    if (!seller) {
      throw new NotFoundException(`sellerId=${sellerId} is non-existent.`);
    }

    // 2. Update status
    seller.updateStatus(status);

    // 3. Save
    return this.sellerRepository.save(seller);
  }
}
