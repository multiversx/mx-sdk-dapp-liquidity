import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
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
  const { address: suiAddress } = useAppKitAccount({
    namespace: 'sui' as any
  });

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

    // Validate transaction bytes
    const MAX_SUI_PAYLOAD_BYTES = 32 * 1024; // 32 KiB

    // Must be a non-empty string
    if (!transaction || typeof transaction !== 'string') {
      throw new Error(
        'Invalid Sui transaction: payload must be a non-empty string'
      );
    }

    // Must be valid base64
    try {
      const decoded = atob(transaction);
      if (decoded.length > MAX_SUI_PAYLOAD_BYTES) {
        throw new Error(
          `Sui transaction payload exceeds maximum size of ${MAX_SUI_PAYLOAD_BYTES} bytes`
        );
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('maximum size')) {
        throw e;
      }
      throw new Error('Invalid Sui transaction: payload is not valid base64');
    }

    // Address must match the connected address
    if (suiParams.address && suiAddress && suiParams.address !== suiAddress) {
      throw new Error(
        `Sui address mismatch: expected ${suiAddress}, got ${suiParams.address}`
      );
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
