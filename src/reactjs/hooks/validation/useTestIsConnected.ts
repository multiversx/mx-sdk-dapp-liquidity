import { useCallback } from 'react';
import { TestContext } from 'yup';
import { getMvxChainId } from '../../../helpers/getMvxChainId';
import { TokenType } from '../../../types/token';
import { useAccount } from '../useAccount';

export const useTestIsConnected = ({
  isMvxConnected
}: {
  isMvxConnected: boolean;
}) => {
  const { address } = useAccount();

  return useCallback(
    <T extends string | undefined>(_value: T, context: TestContext) => {
      const firstToken = context.parent.firstToken as TokenType | undefined;
      const mvxChainId = getMvxChainId();
      const isFromMvxChain = firstToken?.chainId === mvxChainId;

      const isConnected = isFromMvxChain ? isMvxConnected : Boolean(address);

      if (isConnected) {
        return true;
      }

      return context.createError({
        message: 'Please connect your wallet',
        path: context.path
      });
    },
    [address, isMvxConnected]
  );
};
