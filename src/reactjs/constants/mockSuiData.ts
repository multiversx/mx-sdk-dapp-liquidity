import { ChainDTO } from '../../dto/Chain.dto';
import { ChainType } from '../../types/chainType';
import { TokenType } from '../../types/token';

export const SUI_MOCK_CHAIN_ID = 'sui-mainnet';

export const mockSuiChain: ChainDTO = {
  chainId: SUI_MOCK_CHAIN_ID,
  chainName: 'sui',
  pngUrl: 'https://raw.githubusercontent.com/MystenLabs/sui/main/docs/site/static/img/logo.svg',
  svgUrl: 'https://raw.githubusercontent.com/MystenLabs/sui/main/docs/site/static/img/logo.svg',
  chainType: ChainType.sui,
  rpc: 'https://fullnode.mainnet.sui.io:443',
  networkName: 'Sui',
  nativeCurrency: {
    name: 'SUI',
    symbol: 'SUI',
    decimals: 9,
    icon: 'https://raw.githubusercontent.com/MystenLabs/sui/main/docs/site/static/img/logo.svg'
  },
  blockExplorerUrls: ['https://suiscan.xyz/mainnet']
};

export const mockSuiTokens: TokenType[] = [
  {
    chainId: SUI_MOCK_CHAIN_ID,
    address: '0x2::sui::SUI',
    name: 'Sui',
    symbol: 'SUI',
    decimals: 9,
    crosschain: true,
    pngUrl: 'https://raw.githubusercontent.com/MystenLabs/sui/main/docs/site/static/img/logo.svg',
    svgUrl: 'https://raw.githubusercontent.com/MystenLabs/sui/main/docs/site/static/img/logo.svg',
    metadata: {
      minBridgeAmount: '0.1',
      maxBridgeAmount: '100000'
    },
    isNative: true,
    balance: '0'
  },
  {
    chainId: SUI_MOCK_CHAIN_ID,
    address: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    crosschain: true,
    pngUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    svgUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    metadata: {
      minBridgeAmount: '1',
      maxBridgeAmount: '1000000'
    },
    isNative: false,
    balance: '0'
  },
  {
    chainId: SUI_MOCK_CHAIN_ID,
    address: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    crosschain: true,
    pngUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    svgUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    metadata: {
      minBridgeAmount: '1',
      maxBridgeAmount: '1000000'
    },
    isNative: false,
    balance: '0'
  }
];
