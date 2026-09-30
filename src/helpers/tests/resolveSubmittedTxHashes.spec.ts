import { BatchTransactions } from '../../types/batchTransactions';
import { ServerTransaction } from '../../types/transaction';
import { resolveSubmittedTxHashes } from '../resolveSubmittedTxHashes';

const makeTransaction = (
  overrides: Partial<ServerTransaction> = {}
): ServerTransaction =>
  ({
    account: '0xSender',
    txHash: '',
    ...overrides
  }) as ServerTransaction;

const makeBatch = (overrides: Partial<BatchTransactions> = {}) =>
  ({
    batchId: 'batch-1234',
    transactions: [],
    ...overrides
  }) as BatchTransactions;

describe('resolveSubmittedTxHashes', () => {
  it('prefers the hashes returned by the API', () => {
    const batch = makeBatch({
      transactions: [makeTransaction({ txHash: '0xapi' })]
    });
    const signed = [makeTransaction({ txHash: '0xlocal' })];

    expect(resolveSubmittedTxHashes(batch, signed)).toEqual(['0xapi']);
  });

  it('falls back to locally signed hashes when the API returns none', () => {
    const batch = makeBatch({ transactions: [] });
    const signed = [makeTransaction({ txHash: '0xlocal' })];

    expect(resolveSubmittedTxHashes(batch, signed)).toEqual(['0xlocal']);
  });

  it('never falls back to the batchId — it is not a transaction hash', () => {
    const batch = makeBatch({ batchId: 'batch-1234', transactions: [] });

    expect(resolveSubmittedTxHashes(batch, [])).toEqual([]);
  });

  it('drops empty hashes returned by the API', () => {
    const batch = makeBatch({
      transactions: [makeTransaction({ txHash: '' }), makeTransaction()]
    });

    expect(resolveSubmittedTxHashes(batch, [])).toEqual([]);
  });

  it('tolerates a batch without a transactions array', () => {
    const batch = { batchId: 'batch-1234' } as BatchTransactions;

    expect(resolveSubmittedTxHashes(batch, [])).toEqual([]);
  });
});
