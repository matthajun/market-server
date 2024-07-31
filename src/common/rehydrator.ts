import { Injectable, Logger, Type } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { VersionedAggregateRoot } from '@src/shared/domain/versioned-aggregate-root';
import { EventStorePort } from '../shared/application/ports/event-store.port';

@Injectable()
export class Rehydrator {
  private readonly logger = new Logger(Rehydrator.name);

  constructor(
    private readonly eventStore: EventStorePort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async rehydrate<T extends VersionedAggregateRoot>(id: string, cls: Type<T>) {
    this.logger.debug(`rehydrating (id=${id}, clsName=${cls.name})`);
    const events = await this.eventStore.getEvents(id);

    const ClsWithContext = this.eventPublisher.mergeClassContext(cls);
    const aggregate = new ClsWithContext(id);

    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
