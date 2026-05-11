import { RateConfirmationMismatchError } from '../types/errors';
import { ServerTransaction } from '../types/transaction';

interface ConfirmIntent {
  fromChainId: string;
  sender: string;
}

export function assertRateConfirmationMatchesIntent(
  intent: ConfirmIntent,
  transactions: ServerTransaction[]
): void {
  for (const tx of transactions) {
    // Check MvX chainID field (present when the server returns MultiversX transactions)
    if (
      tx.chainID !== undefined &&
      String(tx.chainID) !== String(intent.fromChainId)
    ) {
      throw new RateConfirmationMismatchError(
        `Transaction chainID ${tx.chainID} does not match approved fromChainId ${intent.fromChainId}`
      );
    }

    // Check account field (always present in BaseTransaction — the signing account / sender)
    if (
      tx.account !== undefined &&
      tx.account !== '' &&
      intent.sender !== '' &&
      tx.account.toLowerCase() !== intent.sender.toLowerCase()
    ) {
      throw new RateConfirmationMismatchError(
        `Transaction account ${tx.account} does not match approved sender ${intent.sender}`
      );
    }

    // Check MvX sender field (present when the server returns MultiversX transactions)
    if (
      tx.sender !== undefined &&
      tx.sender !== '' &&
      intent.sender !== '' &&
      tx.sender.toLowerCase() !== intent.sender.toLowerCase()
    ) {
      throw new RateConfirmationMismatchError(
        `Transaction sender ${tx.sender} does not match approved sender ${intent.sender}`
      );
    }
  }
}
