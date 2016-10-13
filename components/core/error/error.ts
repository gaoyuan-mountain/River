export class RvError extends Error {
  constructor(value: string) {
    super();
    this.message = value;
  }
}
