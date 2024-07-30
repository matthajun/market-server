import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { Client, Notification } from 'pg';
import { EventSubscriber } from 'typeorm';
import { EventDeserializer } from './deserializers/event.deserializer';

@Injectable()
@EventSubscriber()
export class EventsBridge
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(EventsBridge.name);
  private client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventBus: EventBus,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  async onApplicationBootstrap() {
    this.client = new Client({
      connectionString: this.configService.get<string>('database.POSTGRES_URL'),
    });

    await this.client.connect();

    await this.client.query('LISTEN event_channel');

    this.client.on('notification', (event) =>
      this.handleEventStoreInsert(event),
    );

    this.logger.log('[로드 완료] 이벤트 브릿지');
  }

  onApplicationShutdown() {
    return this.client.end();
  }

  handleEventStoreInsert(insertEventNotification: Notification) {
    this.logger.debug(
      `LISTEN event channel, ${JSON.stringify(insertEventNotification)}`,
    );
    const insertedEvent = JSON.parse(insertEventNotification.payload);

    const eventInstance = this.eventDeserializer.deserialize(insertedEvent);
    this.eventBus.subject$.next(eventInstance.payload);
  }
}
