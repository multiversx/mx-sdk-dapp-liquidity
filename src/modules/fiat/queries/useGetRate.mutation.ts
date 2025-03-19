import { useMutation } from '@tanstack/react-query';
import { getRate } from '../../../api';
import { getApiURL } from '../../../helpers';
import { RateRequestBody } from '../../../types';

export const useGetRateMutation = () => {
  const mutationFn = async (params: {
    nativeAuthToken: string;
    body: RateRequestBody;
  }) => {
    const { data } = await getRate({
      url: getApiURL(),
      ...params
    });

    return data;
  };

  return useMutation({
    mutationFn
  });
};
