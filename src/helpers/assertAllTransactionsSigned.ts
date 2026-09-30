import { TransactionNotSignedError } from '../types/errors';
import { ServerTransaction } from '../types/transaction';

export function assertAllTransactionsSigned(
  requestedTransactions: ServerTransaction[],
  signedTransactions: ServerTransaction[]
): void {
  if (requestedTransactions.length === 0) {
    throw new TransactionNotSignedError(
      'No transactions were returned for signing'
    );
  }

  if (signedTransactions.length !== requestedTransactions.length) {
    throw new TransactionNotSignedError(
      `Only ${signedTransactions.length} of ${requestedTransactions.length} transactions were signed`
    );
  }
}
