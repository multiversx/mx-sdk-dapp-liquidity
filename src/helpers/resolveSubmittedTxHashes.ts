import { BatchTransactions } from '../types/batchTransactions';
import { ServerTransaction } from '../types/transaction';

export function resolveSubmittedTxHashes(
  batch: BatchTransactions,
  signedTransactions: ServerTransaction[]
): string[] {
  const apiHashes =
    batch?.transactions
      ?.map((transaction) => transaction.txHash)
      .filter((hash): hash is string => Boolean(hash)) ?? [];

  if (apiHashes.length > 0) {
    return apiHashes;
  }

  return signedTransactions
    .map((transaction) => transaction.txHash)
    .filter((hash): hash is string => Boolean(hash));
}
