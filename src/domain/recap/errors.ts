export class RecapProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecapProviderError";
  }
}
