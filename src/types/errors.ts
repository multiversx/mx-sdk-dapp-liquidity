export class RateConfirmationMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateConfirmationMismatchError';
  }
}

/**
 * Generic message - not shown verbatim to end users.
 */
export class ConfirmRateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfirmRateError';
  }
}

/**
 * Thrown when a required form field (fromChainId, toChainId, sender, receiver) is
 * missing or empty before calling confirmRate.
 */
export class MissingConfirmRateDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingConfirmRateDataError';
  }
}
