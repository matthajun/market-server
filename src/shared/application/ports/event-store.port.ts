import { SerializableEvent } from '@src/shared/domain/interfaces/serializable-event';

export abstract class EventStorePort {
  abstract persist(
    eventOrEvents: SerializableEvent | SerializableEvent[],
  ): Promise<void>;
  abstract getEvents(id: string): Promise<SerializableEvent[]>;
}
