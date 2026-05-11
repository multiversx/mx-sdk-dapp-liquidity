import { ServerTransaction } from '../../types/transaction';
import { serializeTransaction } from '../serializeTransaction';

const baseTransaction: ServerTransaction = {
  to: '0x1234567890abcdef1234567890abcdef12345678',
  data: '0x',
  gasLimit: 21000n,
  value: 0n,
  account: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  txHash: ''
};

describe('serializeTransaction', () => {
  it('serialises a normal small BigInt correctly', () => {
    const tx: ServerTransaction = { ...baseTransaction, value: 100n };
    const result = JSON.parse(serializeTransaction(tx));
    expect(result.value).toBe('100');
  });

  it('serialises a BigInt at exactly Number.MAX_SAFE_INTEGER correctly', () => {
    const maxSafe = 9_007_199_254_740_991n;
    const tx: ServerTransaction = { ...baseTransaction, value: maxSafe };
    const result = JSON.parse(serializeTransaction(tx));
    expect(result.value).toBe('9007199254740991');
  });

  it('serialises 10 ETH in wei (above Number.MAX_SAFE_INTEGER) to the exact string without rounding', () => {
    const tenEthInWei = 10_000_000_000_000_000_000n;
    const tx: ServerTransaction = { ...baseTransaction, value: tenEthInWei };
    const result = JSON.parse(serializeTransaction(tx));
    expect(result.value).toBe('10000000000000000000');
  });

  it('serialises a value that would be corrupted by Number() to the exact string', () => {
    // Number(9_007_199_254_740_993n) === 9007199254740992 (rounds down by 1)
    const precisionLoss = 9_007_199_254_740_993n;
    const tx: ServerTransaction = { ...baseTransaction, value: precisionLoss };
    const result = JSON.parse(serializeTransaction(tx));
    expect(result.value).toBe('9007199254740993');
    expect(result.value).not.toBe('9007199254740992');
  });
});
