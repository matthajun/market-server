import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserID } from 'src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from 'src/util/iam/guards/auth.guard';
import { CreateProductsRequestDto } from './dto/create-products.request.dto';
import { CreateProductsService } from '@src/product/application/services/create-products.service';
import { CreateProductsCommand } from '@src/product/application/commands/create-products.command';
import { CreateProductsResponseDto } from '@src/product/presenters/http/dto/create-products.response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Product')
@Controller()
export class CreateProductsController {
  constructor(private readonly createProductsService: CreateProductsService) {}

  @ApiCreatedResponse({ type: CreateProductsResponseDto })
  @ApiOperation({
    operationId: 'create-product',
    summary: '미디어(아이템)을 상품으로 등록',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/products')
  async create(
    @UserID() userId: string,
    @Body() dto: CreateProductsRequestDto,
  ): Promise<CreateProductsResponseDto> {
    const { mediaId, name, price } = dto;
    try {
      const result = await this.createProductsService.createProducts(
        new CreateProductsCommand(mediaId, userId, name, price),
      );

      return plainToInstance(CreateProductsResponseDto, result);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
