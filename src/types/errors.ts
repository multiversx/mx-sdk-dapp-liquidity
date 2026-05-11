export class RateConfirmationMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateConfirmationMismatchError';
  }
}
