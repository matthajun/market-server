export class NotFoundAggregateException extends Error {
  constructor(aggregateId: string) {
    super(`aggregate(id=${aggregateId}) does not exist`);
  }
}
