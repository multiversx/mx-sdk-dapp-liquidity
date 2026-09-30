import { TransactionNotSignedError } from '../../types/errors';
import { ServerTransaction } from '../../types/transaction';
import { assertAllTransactionsSigned } from '../assertAllTransactionsSigned';

const makeEvmTransaction = (
  overrides: Partial<ServerTransaction> = {}
): ServerTransaction =>
  ({
    to: '0xdeadbeef' as `0x${string}`,
    data: '0x' as `0x${string}`,
    gasLimit: BigInt(21000),
    value: BigInt(0),
    account: '0xSender',
    txHash: '',
    ...overrides
  }) as ServerTransaction;

const makeSuiTransaction = (
  overrides: Partial<ServerTransaction> = {}
): ServerTransaction =>
  ({
    account: '0xSuiSender',
    txHash: '',
    suiParams: {
      transactionBytes: 'AAAA',
      sender: '0xSuiSender'
    },
    ...overrides
  }) as ServerTransaction;

describe('assertAllTransactionsSigned', () => {
  it('does not throw when every requested transaction was signed', () => {
    const requested = [makeSuiTransaction()];
    const signed = [
      makeSuiTransaction({
        suiParams: {
          transactionBytes: 'AAAA',
          sender: '0xSuiSender',
          signature: 'deadbeef'
        }
      })
    ];

    expect(() => assertAllTransactionsSigned(requested, signed)).not.toThrow();
  });

  it('throws when nothing was signed (the SUI silent-skip regression)', () => {
    const requested = [makeSuiTransaction()];

    expect(() => assertAllTransactionsSigned(requested, [])).toThrow(
      TransactionNotSignedError
    );
  });

  it('throws when only some of the legs were signed', () => {
    const requested = [makeEvmTransaction(), makeSuiTransaction()];
    const signed = [makeEvmTransaction({ txHash: '0xabc' })];

    expect(() => assertAllTransactionsSigned(requested, signed)).toThrow(
      TransactionNotSignedError
    );
  });

  it('throws when the server returned no transactions to sign at all', () => {
    expect(() => assertAllTransactionsSigned([], [])).toThrow(
      TransactionNotSignedError
    );
  });
});
