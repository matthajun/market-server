import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import baseDirConfig from '@src/configs/base-dir.config';
import { FileWriterPort } from '@src/shared/application/ports/file-writer.port';

@Injectable()
export class FileWriteProvider implements FileWriterPort {
  private readonly logger = new Logger(FileWriteProvider.name);

  private readonly baseDirPath: string;

  constructor(
    @Inject(baseDirConfig.KEY)
    private readonly config: ConfigType<typeof baseDirConfig>,
  ) {
    this.baseDirPath = this.config.baseDirPath;
  }
}
