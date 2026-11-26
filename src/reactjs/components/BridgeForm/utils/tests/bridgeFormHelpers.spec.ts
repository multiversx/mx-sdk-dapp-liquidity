import { TokenType } from '../../../../../types/token';
import { findPairedToken, getAvailableTokens } from '../bridgeFormHelpers';

// The constants barrel pulls in SVG assets that jest cannot parse.
jest.mock('../../../../constants', () => ({ safeWindow: {} }));

const PELL_EVM_ADDRESS = '0xC65d8d96cddDB31328186EFA113a460b0Af9Ec63';

const makeToken = (overrides: Partial<TokenType>): TokenType =>
  ({
    name: 'Pell Network Token',
    symbol: 'PELL',
    decimals: 18,
    ...overrides
  }) as TokenType;

const pellEth = makeToken({ chainId: '1', address: PELL_EVM_ADDRESS });
const pellBsc = makeToken({ chainId: '56', address: PELL_EVM_ADDRESS });
const pellMvx = makeToken({
  chainId: '31',
  address: 'PELL-00610b',
  availableTokens: [
    { symbol: 'PELL', address: PELL_EVM_ADDRESS, chainId: '1' },
    { symbol: 'PELL', address: PELL_EVM_ADDRESS, chainId: '56' }
  ]
});

describe('getAvailableTokens', () => {
  it('resolves tokens sharing the same address on different chains to their own chain', () => {
    const result = getAvailableTokens(pellMvx, [pellEth, pellBsc]);

    expect(result.map((token) => token.chainId)).toEqual(['1', '56']);
  });

  it('matches addresses case-insensitively', () => {
    const result = getAvailableTokens(pellMvx, [
      { ...pellBsc, address: PELL_EVM_ADDRESS.toLowerCase() }
    ]);

    expect(result.map((token) => token.chainId)).toEqual(['56']);
  });

  it('skips available tokens whose chain is not in the target list', () => {
    const result = getAvailableTokens(pellMvx, [pellEth]);

    expect(result.map((token) => token.chainId)).toEqual(['1']);
  });
});

describe('findPairedToken', () => {
  it('returns the first available token on its own chain', () => {
    expect(findPairedToken(pellMvx, [pellBsc, pellEth])?.chainId).toEqual('1');
  });
});
