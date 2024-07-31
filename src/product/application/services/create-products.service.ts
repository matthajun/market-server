import { CreateProductsCommand } from '../commands/create-products.command';
import { ProductRepositoryPort } from '@src/product/application/ports/product.repository.port';
import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetMediaDetailService } from '@src/util/grpc/interface/get-media-detail.interface';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CreateProductsService {
  private readonly getMediaDetailService: GetMediaDetailService;

  constructor(
    private readonly productRepository: ProductRepositoryPort,
    @Inject('get-media-detail-client-grpc')
    private readonly getMediaDetailGrpcClient: ClientGrpc,
  ) {
    this.getMediaDetailService =
      this.getMediaDetailGrpcClient.getService<GetMediaDetailService>(
        'GetMediaDetailService',
      );
  }

  /**
   * 판매 상품 등록
   * @param command {CreateProductsCommand}
   * @returns
   */
  async createProducts(command: CreateProductsCommand): Promise<ProductEntity> {
    const { mediaId, userId, name, price } = command;

    //TODO: sellerThumbnailImageId 값을 auth에 profile 조회를 요청하여 받아와야 함
    //TODO: 유저 프로필 변경 이벤트(AUTH.UPDATE_PROFILE)발행 시 sellerThumbnailImageId을 업데이트하는 로직이 필요 함 (BackLog, TW-1958)
    const sellerThumbnailImageId = '6476d7b7786b05cdb7ba6e79';

    try {
      // 1. Request media detail to media-management server
      // Media-management 서버가 작동 중이지 않으면 해당 코드는 작동하지 않음
      const media = await firstValueFrom(
        this.getMediaDetailService.getMediaDetail({ media_id: mediaId }),
      );

      // 2. Check media's owner
      // 자신의 미디어가 아니면 상품 등록이 불가 함
      if (!this.checkMediaOwner(media.uploader_id, userId)) {
        throw new BadRequestException(
          `Product registration is not possible unless the media was uploaded by the user.`,
        );
      }

      // 3. Save and return
      const entity = ProductEntity.create({
        mediaId,
        userId,
        name,
        price,
        sellerThumbnailImageId,
      });
      return this.productRepository.save(entity);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * 미디어 uploadId 와 userId 가 일치하는지 확인
   * @param uploaderId
   * @param userId
   * @return
   */
  checkMediaOwner(uploaderId: string, userId: string): boolean {
    return uploaderId === userId;
  }
}
