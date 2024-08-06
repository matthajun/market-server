import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rehydrator } from '@src/common/rehydrator';
import { EventStorePort } from '@src/shared/application/ports/event-store.port';
import { EventDeserializer } from './deserializers/event.deserializer';
import { EventEntity } from './entities/event.entity';
import { EventsBridge } from './events-bridge';
import { PgEventStore } from './pg-event-store';
import { EventStorePublisher } from './publishers/event-store.publisher';
import { EventSerializer } from './serializers/event.serializer';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [
    PgEventStore,
    {
      provide: EventStorePort,
      useExisting: PgEventStore,
    },
    Rehydrator,
    EventStorePublisher,
    EventSerializer,
    EventDeserializer,
    EventsBridge,
  ],
  exports: [EventStorePort, Rehydrator],
})
export class EventStoreModule {}
