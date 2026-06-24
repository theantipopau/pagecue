export class BookSearchProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookSearchProviderError";
  }
}
