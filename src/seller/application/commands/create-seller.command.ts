export class CreateSellerCommand {
  constructor(
    readonly userId: string,
    readonly firstName: string,
    readonly lastName: string,
  ) {}
}
