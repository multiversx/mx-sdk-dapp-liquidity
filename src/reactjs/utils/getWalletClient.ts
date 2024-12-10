import { createWalletClient, custom, EIP1193Provider } from 'viem';
import { findChain } from '../helpers/findChain';
import { ethereum } from '../providers/ethereum';

export const getWalletClient = async (
  provider: EIP1193Provider = ethereum()
) => {
  const chain = await findChain(provider);

  if (!chain) {
    throw new Error('Chain not found');
  }

  return createWalletClient({
    chain,
    transport: custom(provider)
  });
};
