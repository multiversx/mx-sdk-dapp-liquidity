import { defineChain } from 'viem';

export const berachainMainnet = /*#__PURE__*/ defineChain({
  id: 80094,
  caipNetworkId: 'eip155:80094',
  chainNamespace: 'eip155',
  name: 'Berachain Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA Token',
    symbol: 'BERA'
  },
  rpcUrls: {
    default: { http: ['https://rpc.berachain.com'] }
  },
  blockExplorers: {
    default: {
      name: 'Berascan',
      url: 'https://berascan.com'
    }
  }
});
