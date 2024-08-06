import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { CartItemResponseDto } from '@src/cart/presenters/http/dto/cart-item.response.dto';
import { Cart } from '@src/cart/domain/cart';

@Exclude()
export class AddToCartResponseDto {
  @ApiProperty({ example: '01HJ3846YJZAPZEGYYXPE3WV07' })
  @Expose()
  id: string;

  @ApiProperty({ type: CartItemResponseDto, isArray: true })
  @Expose()
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];

  @ApiProperty({ example: 5 })
  @Expose()
  totalCount: number;

  @ApiProperty({ example: 10.23 })
  @Expose()
  totalPrice: number;

  /**
   * `장바구니 상품 추가` 응답을 `장바구니 조회`의 응답과 동일하게 함
   * @param cart
   * @returns
   */
  static toResponseDto(cart: Cart): AddToCartResponseDto {
    const responseDto = {
      id: cart.id,

      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.productName,
        price: item.price.value,
        productThumbnailImage: item.mediaId,
      })),

      totalCount: cart.items.length,

      // 자바스크립트는 소수인 변수를 메모리에 저장 시 2진수로 변환하는 과정에서 무한소수가 발생하고 이 값을 보정한다.
      // 때문에, `1.01 + 1.01 + 1.01 = 3.030000000...` 과 깉은 계산 오차가 발생한다.
      // 이 계산 오차를 `Math.round()`로 값을 반올림하여 totalPrice 를 보정한다. (TW-2069)
      totalPrice: cart.items.reduce(
        (acc, cur) => Math.round((acc + cur.price['value']) * 100) / 100,
        0,
      ),
    };

    return plainToInstance(AddToCartResponseDto, responseDto);
  }
}
