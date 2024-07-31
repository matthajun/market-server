import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DownloadProductResponseDto {
  @ApiProperty({ example: 'https://gateway-server-new/...' })
  @Expose()
  downloadLink: string;
}
