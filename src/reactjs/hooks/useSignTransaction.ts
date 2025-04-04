import { useAppKitProvider } from '@reown/appkit/react';
import type { BitcoinConnector } from '@reown/appkit-adapter-bitcoin';
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
  const { walletProvider: solWalletProvider } =
    useAppKitProvider<Provider>('solana');
  const { walletProvider: btcWalletProvider } =
    useAppKitProvider<BitcoinConnector>('bip122');

  const signTransactionSolanaTransaction = async ({
    feePayer,
    instructions
  }: {
    feePayer: string;
    instructions: ServerTransactionInstruction[];
  }) => {
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

      return await solWalletProvider.signAndSendTransaction(transaction);
    }
  };

  const signPSBT = async (params: {
    psbt: string;
    signInputs: {
      address: string;
      index: number;
      sighashTypes: number[];
    }[];
    broadcast: boolean;
  }) => {
    if (!btcWalletProvider) {
      throw Error('user is disconnected');
    }

    params.signInputs = [];

    const signature = await btcWalletProvider.signPSBT(params);

    return signature.psbt;
  };

  return {
    evm: {
      hash,
      signTransaction: signEvmTransaction,
      ...rest
    },
    solana: {
      signTransaction: signTransactionSolanaTransaction,
      connection,
      walletProvider: solWalletProvider
    },
    bitcoin: {
      signTransaction: signPSBT,
      walletProvider: btcWalletProvider
    }
  };
};
