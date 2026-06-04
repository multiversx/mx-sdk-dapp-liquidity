import { ConfirmRateError, MissingConfirmRateDataError } from '../types/errors';

export interface ConfirmRateGuardParams {
  nativeAuthToken?: string | null;
  orderId?: string | null;
  fromChainId?: string | null;
  toChainId?: string | null;
  sender?: string | null;
  receiver?: string | null;
}

/**
 * Asserts that all required data is present before calling confirmRate.
 *
 * Throws {@link ConfirmRateError} for missing system tokens (nativeAuthToken, orderId) —
 * these indicate an unexpected app-state problem and should not be shown verbatim.
 *
 * Throws {@link MissingConfirmRateDataError} for missing form fields (fromChainId,
 * toChainId, sender, receiver) — the message names the field and can be surfaced to the
 * user to explain why the bridge couldn't proceed.
 */
export function assertConfirmRateData({
  nativeAuthToken,
  orderId,
  fromChainId,
  toChainId,
  sender,
  receiver
}: ConfirmRateGuardParams): void {
  // System tokens — generic errors, not user-facing field messages
  if (!nativeAuthToken) {
    throw new ConfirmRateError(
      'Cannot confirm rate. Please reconnect your wallet.'
    );
  }
  if (!orderId) {
    throw new ConfirmRateError(
      'Cannot confirm rate. Please request a new rate.'
    );
  }

  // Required form fields — specific, user-facing messages
  if (!fromChainId) {
    throw new MissingConfirmRateDataError('Missing source chain.');
  }
  if (!toChainId) {
    throw new MissingConfirmRateDataError('Missing destination chain.');
  }
  if (!sender) {
    throw new MissingConfirmRateDataError('Missing sender address.');
  }
  if (!receiver) {
    throw new MissingConfirmRateDataError('Missing destination address');
  }
}
