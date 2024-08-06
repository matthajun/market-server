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

  /**
   * `aggregateId` 값 으로 `event` 테이블에서 결과 payload 를 리턴
   * @param id
   * @param cls
   * @returns
   */
  async rehydrate<T extends VersionedAggregateRoot>(id: string, cls: Type<T>) {
    this.logger.debug(`rehydrating (id=${id}, clsName=${cls.name})`);
    const events = await this.eventStore.getEvents(id);

    const ClsWithContext = this.eventPublisher.mergeClassContext(cls);
    const aggregate = new ClsWithContext(id);

    aggregate.loadFromHistory(events);

    return aggregate;
  }
}
