import { useAppKitProvider } from '@reown/appkit/react';
import {
  useAppKitConnection,
  type Provider
} from '@reown/appkit-adapter-solana/react';
import {
  PublicKey,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js';
import { useSendTransaction } from 'wagmi';
import { ServerTransactionInstruction } from '../../types';

export const useSignTransaction = () => {
  const {
    data: hash,
    sendTransactionAsync: signEvmTransaction,
    ...rest
  } = useSendTransaction();

  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>('solana');

  async function signTransactionSolanaTransaction({
    feePayer,
    instructions
  }: {
    feePayer: string;
    instructions: ServerTransactionInstruction[];
  }) {
    for (const instruction of instructions) {
      const instructionData = Buffer.from(instruction.data);
      const sender = new PublicKey(instruction.keys[0].pubkey);
      const receiver = new PublicKey(instruction.keys[1].pubkey);

      const transactionInstruction = new TransactionInstruction({
        keys: [
          { pubkey: sender, isSigner: true, isWritable: true },
          { pubkey: receiver, isSigner: false, isWritable: true }
        ],
        programId: new PublicKey(instruction.programId),
        data: instructionData
      });

      const transaction = new Transaction().add(transactionInstruction);
      transaction.feePayer = new PublicKey(feePayer);

      if (connection) {
        transaction.recentBlockhash = (
          await connection.getLatestBlockhash('confirmed')
        ).blockhash;
      }

      return await walletProvider.signAndSendTransaction(transaction);
    }
  }

  return {
    evm: {
      hash,
      signTransaction: signEvmTransaction,
      ...rest
    },
    solana: {
      signTransaction: signTransactionSolanaTransaction,
      connection,
      walletProvider
    }
  };
};
