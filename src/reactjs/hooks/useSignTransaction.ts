import { useAppKitProvider } from '@reown/appkit/react';
import type { BitcoinConnector } from '@reown/appkit-adapter-bitcoin';
import {
  useAppKitConnection,
  type Provider
} from '@reown/appkit-adapter-solana/react';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionInstructionCtorFields
} from '@solana/web3.js';
import { useSendTransaction } from 'wagmi';

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
  // TODO: type properly when @reown exports Sui provider type
  const { walletProvider: suiWalletProvider } = useAppKitProvider<any>('sui');

  const signTransactionSolanaTransaction = async ({
    feePayer,
    instructions,
    recentBlockhash
  }: {
    feePayer: string;
    instructions: TransactionInstructionCtorFields[];
    recentBlockhash?: string;
  }) => {
    for (const instruction of instructions) {
      const transactionInstruction = new TransactionInstruction({
        ...instruction
      });

      const transaction = new Transaction().add(transactionInstruction);
      transaction.feePayer = new PublicKey(feePayer);

      if (connection) {
        transaction.recentBlockhash =
          recentBlockhash ??
          (await connection.getLatestBlockhash('confirmed')).blockhash;
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

  const signSuiTransaction = async (suiParams?: {
    /** Base64 BCS transaction bytes (Reown / WalletConnect `sui_signAndExecuteTransaction`). */
    transaction?: string;
    /** @deprecated use `transaction` — same bytes, older name */
    transactionBlock?: string;
    address: string;
    options?: Record<string, unknown>;
  }) => {
    const transaction = suiParams?.transaction ?? suiParams?.transactionBlock;

    if (!transaction) {
      throw new Error('No Sui transaction bytes provided');
    }

    if (!suiParams?.address) {
      throw new Error('No Sui sender address');
    }

    if (!suiWalletProvider) {
      throw new Error('Sui wallet not connected');
    }

    const result = await suiWalletProvider.request({
      method: 'sui_signTransaction',
      params: {
        transaction,
        address: suiParams.address
      }
    });

    if (!result) {
      throw new Error('Sui wallet did not return a signature');
    }

    return result.signature;
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
    },
    sui: {
      signTransaction: signSuiTransaction,
      walletProvider: suiWalletProvider
    }
  };
};
