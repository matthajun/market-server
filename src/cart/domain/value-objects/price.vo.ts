export class Price {
  constructor(readonly value: number) {}

  toJSON() {
    return this.value;
  }

  add(other: Price): Price {
    return new Price(this.value + other.value);
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }
}
