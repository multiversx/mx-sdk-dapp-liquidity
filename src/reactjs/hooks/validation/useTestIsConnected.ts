import { useCallback } from 'react';
import { TestContext } from 'yup';
import { useAccount } from '../useAccount';

export const useTestIsConnected = () => {
  const { address } = useAccount();

  return useCallback(
    <T extends string | undefined>(_value: T, context: TestContext) => {
      if (Boolean(address)) {
        return true;
      }

      return context.createError({
        message: 'Please connect your wallet',
        path: context.path
      });
    },
    [address]
  );
};
