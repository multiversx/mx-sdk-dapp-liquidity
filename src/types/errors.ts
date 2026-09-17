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

/**
 * Thrown when a bridge leg could not be signed — the wallet returned nothing, the
 * server omitted the chain-specific signing payload, or the user aborted.
 */
export class TransactionNotSignedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionNotSignedError';
  }
}
