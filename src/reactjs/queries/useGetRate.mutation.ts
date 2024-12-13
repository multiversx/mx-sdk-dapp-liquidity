import { useMutation } from '@tanstack/react-query';
import { getRate } from '../../api/getRate.ts';
import { RateRequestBody } from '../../types/rate.ts';
import { API_URL } from '../constants/general';

export const useGetRateMutation = () => {
  const mutationFn = async (params: {
    nativeAuthToken: string;
    body: RateRequestBody;
  }) => {
    const { data } = await getRate({
      url: API_URL,
      ...params
    });
    return data;
  };

  return useMutation({
    mutationFn
  });
};
