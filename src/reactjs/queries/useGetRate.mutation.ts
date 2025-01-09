import { useMutation } from '@tanstack/react-query';
import { getRate } from '../../api/getRate';
import { getApiURL } from '../../helpers/getApiURL';
import { RateRequestBody } from '../../types/rate';

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
