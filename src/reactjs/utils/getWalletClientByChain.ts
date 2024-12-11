import { Chain, createWalletClient, custom } from 'viem';
import { ethereum } from '../providers/ethereum';

export const getWalletClientByChain = (chain: Chain, provider = ethereum()) => {
  if (!provider) {
    throw new Error('Provider not found');
  }

  return createWalletClient({
    chain,
    transport: custom(provider)
  });
};
