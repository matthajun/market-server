import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserID } from 'src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from 'src/util/iam/guards/auth.guard';
import { UpdateProductsRequestDto } from './dto/update-products.request.dto';
import { UpdateProductsResponseDto } from './dto/update-products.response.dto';
import { UpdateProductsService } from '@src/product/application/services/update-products.service';
import { UpdateProductsCommand } from '@src/product/application/commands/update-products.command';

@ApiTags('Product')
@Controller()
export class UpdateProductsController {
  constructor(private readonly updateProductsService: UpdateProductsService) {}

  @ApiOkResponse({ type: UpdateProductsResponseDto })
  @ApiNotFoundResponse({ description: '해당 상품이 존재하지 않는 경우' })
  @ApiForbiddenResponse({ description: '본인이 등록한 상품이 아닌 경우' })
  @ApiOperation({
    operationId: 'update-product',
    summary: '등록했던 상품 수정',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/products/:productId')
  async update(
    @UserID() userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductsRequestDto,
  ): Promise<UpdateProductsResponseDto> {
    const { name, price } = dto;
    const result = await this.updateProductsService.updateProducts(
      new UpdateProductsCommand(productId, userId, name, price),
    );

    return plainToInstance(UpdateProductsResponseDto, result);
  }
}
