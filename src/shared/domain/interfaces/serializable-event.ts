/**
 * 이벤트 페이로드
 * toJSON을 통해 타입 추론 및 변환
 */
export type SerializedEventPayload<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends { toJSON(): infer U } // toJSON() 있으면 타입 U로 대체
        ? U
        : SerializedEventPayload<T[K]>;
    }
  : T; // Object가 아닌 경우 아니면 primitive 타입일태니 해당 타입으로 대체

/**
 * 이벤트
 */
export interface SerializableEvent<T = any> {
  id: string;
  aggregateId: string;
  type: string;
  position: number;
  payload: SerializedEventPayload<T>;
}
