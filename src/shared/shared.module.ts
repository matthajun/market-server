import { Module } from '@nestjs/common';
import { EventStoreModule } from '@src/shared/infra/event-store/event-store.module';
import { FileWriterModule } from '@src/shared/infra/file-writer/file-writer.module';

@Module({
  imports: [EventStoreModule, FileWriterModule],
  exports: [EventStoreModule, FileWriterModule],
})
export class SharedModule {}
