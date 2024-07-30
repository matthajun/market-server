import { Injectable } from '@nestjs/common';
import { VersionedAggregateRoot } from '@src/shared/domain/versioned-aggregate-root';
import { SerializableEvent } from 'src/shared/domain/interfaces/serializable-event';
import { monotonicFactory } from 'ulid';

@Injectable()
export class EventSerializer {
  serialize<T>(
    event: T,
    dispatcher: VersionedAggregateRoot,
  ): SerializableEvent<T> {
    const eventType = event.constructor?.name;
    if (!eventType) {
      throw new Error('Incompatible event type');
    }

    const aggregateId = dispatcher.id;
    const eventUlid = monotonicFactory();
    return {
      id: eventUlid(),
      aggregateId,
      position: dispatcher.version.value + 1,
      type: eventType,
      payload: this.toJSON(event),
    };
  }

  private toJSON<T>(payload: T) {
    if (typeof payload !== 'object' || payload === null) {
      return payload;
    }

    if ('toJSON' in payload && typeof payload.toJSON === 'function') {
      return payload.toJSON();
    }

    if (Array.isArray(payload)) {
      return payload.map((item) => this.toJSON(item));
    }

    // Object.entires({a:1, b:2, c:3}) => [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]
    return Object.entries(payload).reduce((acc, [key, value]) => {
      acc[key] = this.toJSON(value);

      return acc;
    }, {});
  }
}
