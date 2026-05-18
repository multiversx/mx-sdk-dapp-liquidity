import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { checkAccount } from '../../api/checkAccount';
import { getApiURL } from '../../helpers/getApiURL';
import { useWeb3App } from '../context/useWeb3App';
import { useBridgeApiChainId } from '../hooks/useBridgeApiChainId';

export const useCheckAccountQuery = () => {
  const { address } = useAppKitAccount();
  const bridgeApiChainId = useBridgeApiChainId();
  const { nativeAuthToken } = useWeb3App();

  const queryFn = async () => {
    try {
      const { data } = await checkAccount({
        url: getApiURL(),
        walletAddress: address ?? '',
        chainId: bridgeApiChainId ?? '',
        nativeAuthToken
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const retry = (_failureCount: number, error: AxiosError) => {
    return error.response?.status === 404;
  };

  return useQuery({
    queryKey: ['check-account', address, bridgeApiChainId],
    queryFn,
    retry,
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0
  });
};
