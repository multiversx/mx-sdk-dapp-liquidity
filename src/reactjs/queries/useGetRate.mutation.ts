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
    mutationFn,
    onSuccess: (data) => {
      const currentTime = new Date().getTime();

      if (data.expiresAt && new Date(data.expiresAt).getTime() < currentTime) {
        console.warn('Retrying due to expired rate');
        throw new Error('Retrying due to expired rate');
      }

      return data;
    },
    retry: (failureCount, error) => {
      return (
        error.message === 'Retrying due to expired rate' && failureCount < 2
      );
    }
  });
};
