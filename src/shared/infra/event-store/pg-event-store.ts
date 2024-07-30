import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventStorePort } from '@src/shared/application/ports/event-store.port';
import { NotFoundAggregateException } from '@src/shared/domain/exceptions/not-found-aggregate.exception';
import { SerializableEvent } from '@src/shared/domain/interfaces/serializable-event';
import { QueryFailedError, Repository } from 'typeorm';
import { EventDeserializer } from './deserializers/event.deserializer';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class PgEventStore implements EventStorePort {
  private readonly logger = new Logger(PgEventStore.name);

  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  async persist(
    eventOrEvents: SerializableEvent | SerializableEvent[],
  ): Promise<void> {
    const events = Array.isArray(eventOrEvents)
      ? eventOrEvents
      : [eventOrEvents];

    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(EventEntity, events);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      // Duplicated unique index - https://www.postgresql.org/docs/current/errcodes-appendix.html
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        this.logger.error(e);
      } else {
        throw e;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async getEvents(id: string): Promise<SerializableEvent[]> {
    const events = await this.repository.find({
      where: { aggregateId: id },
      order: { position: 'ASC' },
    });

    if (events.length === 0) {
      throw new NotFoundAggregateException(id);
    }

    return events.map((event) => this.eventDeserializer.deserialize(event));
  }
}
