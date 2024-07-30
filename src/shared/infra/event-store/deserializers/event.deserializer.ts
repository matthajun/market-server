import { Injectable, Type } from '@nestjs/common';

import { SerializableEvent } from 'src/shared/domain/interfaces/serializable-event';
import { EventEntity } from '../entities/event.entity';
import { EventClsRegistry } from '../event-cls.registry';

@Injectable()
export class EventDeserializer {
  deserialize<T>(event: EventEntity): SerializableEvent<T> {
    const eventCls = this.getEventClassByType(event.type);

    return {
      ...event,
      payload: this.instantiateSerializedEvent(eventCls, event.payload),
    };
  }

  getEventClassByType(type: string) {
    return EventClsRegistry.get(type);
  }

  /**
   * 이벤트를 plain object 로 인스턴스화 합니다.
   * @param eventCls
   * @param data
   * @returns
   */
  instantiateSerializedEvent<T extends Type>(
    eventCls: T,
    data: Record<string, any>,
  ) {
    return Object.assign(Object.create(eventCls.prototype), data);
  }
}
