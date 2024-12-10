import { Chain, createWalletClient, custom, EIP1193Provider } from 'viem';
import * as chains from 'viem/chains';
import { ethereum } from '../providers/ethereum';

const findChain = async (provider: EIP1193Provider) => {
  const chainId = Number(await provider.request({ method: 'eth_chainId' }));
  const chainsArr = Object.keys(chains);

  const chain = chainsArr.find(
    (c: string) => (chains as Record<string, Chain>)[c].id === chainId
  );

  if (!chain) {
    return null;
  }

  return (chains as Record<string, Chain>)[chain];
};

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
