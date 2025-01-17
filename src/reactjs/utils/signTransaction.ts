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

  // TODO fix typescript error
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const signature = await sendTransaction(client, transaction);

  // TODO send signed transaction to the server
  return {
    ...transaction,
    signature
  };
}
