import { Chain, createWalletClient, custom, EIP1193Provider } from 'viem';
import { ethereum } from '../providers/ethereum';

export const getWalletClientByChain = (
  chain: Chain,
  provider: EIP1193Provider = ethereum()
) => {
  return createWalletClient({
    chain,
    transport: custom(provider)
  });
};
