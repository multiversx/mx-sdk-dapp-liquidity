import { useMutation } from '@tanstack/react-query';
import { linkAccount } from '../../api/linkAccount.ts';
import { getApiURL } from '../../helpers/getApiURL';
import { LinkAccountRequestBody } from '../../types/linkAccount';

export const useLinkAccountMutation = () => {
  const mutationFn = async (params: {
    nativeAuthToken: string;
    body: LinkAccountRequestBody;
  }) => {
    const { data } = await linkAccount({
      url: getApiURL(),
      ...params
    });

    return data;
  };

  return useMutation({
    mutationFn
  });
};
