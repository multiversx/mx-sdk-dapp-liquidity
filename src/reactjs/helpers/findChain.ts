import { Chain, EIP1193Provider } from 'viem';
import * as chains from 'viem/chains';

export async function findChain(provider: EIP1193Provider) {
  const chainId = Number(await provider.request({ method: 'eth_chainId' }));
  const chainsArr = Object.keys(chains);

  const chain = chainsArr.find(
    (c: string) => (chains as Record<string, Chain>)[c].id === chainId
  );

  if (!chain) {
    return null;
  }

  return (chains as Record<string, Chain>)[chain];
}
