import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EventBus, IEvent, IEventPublisher } from '@nestjs/cqrs';
import { EventStorePort } from '@src/shared/application/ports/event-store.port';
import { VersionedAggregateRoot } from '@src/shared/domain/versioned-aggregate-root';
import { EventSerializer } from '../serializers/event.serializer';

@Injectable()
export class EventStorePublisher
  implements OnApplicationBootstrap, IEventPublisher
{
  private readonly logger = new Logger(EventStorePublisher.name);

  constructor(
    private readonly eventStore: EventStorePort,
    private readonly eventBus: EventBus,
    private readonly eventSerializer: EventSerializer,
  ) {}

  onApplicationBootstrap() {
    this.logger.debug('[LOADED] Set event bus publisher');
    this.eventBus.publisher = this;
  }

  publish<TEvent extends IEvent>(
    event: TEvent,
    dispatcher: VersionedAggregateRoot,
  ) {
    const serializableEvent = this.eventSerializer.serialize(event, dispatcher);
    return this.eventStore.persist(serializableEvent);
  }

  publishAll<TEvent extends IEvent>(
    events: TEvent[],
    dispatcher: VersionedAggregateRoot,
  ) {
    const serializableEvents = events
      .map((event) => this.eventSerializer.serialize(event, dispatcher))
      .map((serializableEvent, index) => ({
        ...serializableEvent,
        position: dispatcher.version.value + index + 1,
      }));

    return this.eventStore.persist(serializableEvents);
  }
}
