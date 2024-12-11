import { createWalletClient, custom } from 'viem';
import { findChain } from '../helpers/findChain';
import { ethereum } from '../providers/ethereum';

export const getWalletClient = async (provider = ethereum()) => {
  if (!provider) {
    throw new Error('Provider not found');
  }

  const chain = await findChain(provider);

  if (!chain) {
    throw new Error('Chain not found');
  }

  return createWalletClient({
    chain,
    transport: custom(provider)
  });
};
