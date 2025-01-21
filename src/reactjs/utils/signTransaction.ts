import { getWalletClient } from './getWalletClient';
import { TransactionType } from '../../types/transaction';

export async function signTransaction({
  transaction
}: {
  transaction: TransactionType;
}) {
  const client = await getWalletClient();

  if (!client) {
    throw new Error('Client not found');
  }

  const request = (await client.prepareTransactionRequest(
    transaction
  )) as unknown as TransactionType;
  const signature = await client.signTransaction(request);

  return {
    ...transaction,
    signature
  };
}
