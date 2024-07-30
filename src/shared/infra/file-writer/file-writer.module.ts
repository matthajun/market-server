import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import fileWriterConfig from 'src/configs/base-dir.config';

import { FileWriteProvider } from './file-writer.provider';
import { FileWriterPort } from '@src/shared/application/ports/file-writer.port';

@Module({
  imports: [ConfigModule.forFeature(fileWriterConfig)],
  providers: [
    {
      provide: FileWriterPort,
      useClass: FileWriteProvider,
    },
  ],
  exports: [FileWriterPort],
})
export class FileWriterModule {}
