import debounce from 'lodash/debounce';
import { useCallback, useEffect } from 'react';
import { TokenType } from '../../../../types/token';

let fetchRateInterval: ReturnType<typeof setInterval>;

interface UseBridgeRateFetchingProps {
  firstAmount: string;
  firstToken?: TokenType;
  secondToken?: TokenType;
  accountAddress?: string;
  fromChainId?: string;
  toChainId: string;
  nativeAuthToken?: string;
  forceRefetchRate: number;
  getRate: (params: {
    nativeAuthToken: string;
    body: {
      tokenIn: string;
      amountIn: string;
      fromChainId: string;
      tokenOut: string;
      toChainId: string;
    };
  }) => void;
}

export const useBridgeRateFetching = ({
  firstAmount,
  firstToken,
  secondToken,
  accountAddress,
  fromChainId,
  toChainId,
  nativeAuthToken,
  forceRefetchRate,
  getRate
}: UseBridgeRateFetchingProps) => {
  const fetchRateDebounced = useCallback(
    debounce(async (amount: string) => {
      if (
        !amount ||
        !Number(amount) ||
        !accountAddress ||
        !firstToken?.address ||
        !secondToken?.address ||
        !fromChainId
      ) {
        return;
      }

      getRate({
        nativeAuthToken: nativeAuthToken ?? '',
        body: {
          tokenIn: firstToken.address,
          amountIn: amount,
          fromChainId,
          tokenOut: secondToken.address,
          toChainId
        }
      });
    }, 500),
    [
      accountAddress,
      firstToken?.address,
      secondToken?.address,
      fromChainId,
      toChainId,
      nativeAuthToken,
      getRate
    ]
  );

  useEffect(() => {
    if (!firstAmount) {
      return;
    }

    fetchRateDebounced(firstAmount);

    if (fetchRateInterval) {
      clearInterval(fetchRateInterval);
    }

    fetchRateInterval = setInterval(() => {
      fetchRateDebounced(firstAmount);
    }, 50 * 1000);

    return () => clearInterval(fetchRateInterval);
  }, [firstAmount, forceRefetchRate, fetchRateDebounced]);

  return { fetchRateDebounced };
};
