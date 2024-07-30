export abstract class FakePaymentServicePort {
  abstract validateOrder(transactionId: string): Promise<boolean>;
}
