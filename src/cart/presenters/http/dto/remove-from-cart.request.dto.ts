import { ApiProperty } from '@nestjs/swagger';
import { IsStringOrArray } from '@src/common/decorators/is-string-or-array.decorator';

export class RemoveFromCartRequestDto {
  @ApiProperty({
    example: '01HMQH8KGZVM9EKR4J5CBBG0Q2',
    description: `["01HMQH8KGZVM9EKR4J5CBBG0Q2", "01HMQH8KGZVM9EKR4J5CBBG0Q3"] 식의 배열 값도 입력 가능`,
  })
  @IsStringOrArray()
  productIdOrProductIds: string | string[];
}
