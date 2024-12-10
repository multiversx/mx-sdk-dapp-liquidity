import { sendTransaction } from 'viem/actions';
import { TransactionType } from 'types/transaction';
import { getWalletClient } from './getWalletClient';

export async function signTransaction({
  transaction
}: {
  transaction: TransactionType;
}) {
  const client = await getWalletClient();

  if (!client) {
    throw new Error('Client not found');
  }

  const signature = await sendTransaction(client, transaction);
  return {
    ...transaction,
    signature
  };
}
