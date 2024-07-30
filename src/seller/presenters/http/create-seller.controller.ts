import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserID } from 'src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from 'src/util/iam/guards/auth.guard';
import { SellerResponseDto } from '@src/seller/presenters/http/dto/seller.response.dto';
import { CreateSellerService } from '@src/seller/application/services/create-seller.service';
import { CreateSellerCommand } from '@src/seller/application/commands/create-seller.command';
import { CreateSellerRequestDto } from '@src/seller/presenters/http/dto/create-seller.request.dto';

@ApiTags('Seller')
@Controller()
export class CreateSellerController {
  constructor(private readonly createSellerService: CreateSellerService) {}

  @ApiOkResponse({ type: SellerResponseDto })
  @ApiOperation({
    operationId: 'create-seller',
    summary: '판매자 등록',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/sellers')
  async create(@UserID() userId: string, @Body() dto: CreateSellerRequestDto) {
    const { firstName, lastName } = dto;
    const result = await this.createSellerService.create(
      new CreateSellerCommand(userId, firstName, lastName),
    );

    return plainToInstance(SellerResponseDto, result);
  }
}
