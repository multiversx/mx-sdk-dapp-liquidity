import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { checkAccount } from '../../api/checkAccount';
import { getApiURL } from '../../helpers/getApiURL';
import { useGetChainId } from '../hooks';

export const useCheckAccountQuery = ({
  nativeAuthToken
}: {
  nativeAuthToken?: string;
}) => {
  const { address } = useAppKitAccount();
  const chainId = useGetChainId();

  const queryFn = async () => {
    try {
      const { data } = await checkAccount({
        url: getApiURL(),
        walletAddress: address ?? '',
        chainId: chainId ? chainId.toString() : '',
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
    queryKey: ['check-account', address, chainId, nativeAuthToken],
    queryFn,
    retry,
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0
  });
};
