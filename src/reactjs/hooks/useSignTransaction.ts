import { useSendTransaction } from 'wagmi';

export const useSignTransaction = () => {
  const {
    data: hash,
    sendTransactionAsync: signTransaction,
    ...rest
  } = useSendTransaction();

  return {
    hash,
    signTransaction,
    ...rest
  };
};
