import { RateConfirmationMismatchError } from '../../types/errors';
import { ServerTransaction } from '../../types/transaction';
import { assertRateConfirmationMatchesIntent } from '../assertRateConfirmationMatchesIntent';

const makeTransaction = (
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

describe('assertRateConfirmationMatchesIntent', () => {
  const intent = { fromChainId: '1', sender: '0xSender' };

  it('does not throw for an empty transactions array', () => {
    expect(() => assertRateConfirmationMatchesIntent(intent, [])).not.toThrow();
  });

  it('does not throw when chainID and account match', () => {
    const tx = makeTransaction({ chainID: '1', account: '0xSender' });
    expect(() =>
      assertRateConfirmationMatchesIntent(intent, [tx])
    ).not.toThrow();
  });

  it('does not throw when chainID is undefined (field absent)', () => {
    const tx = makeTransaction({ account: '0xSender' });
    // chainID is not set — should be skipped
    expect(() =>
      assertRateConfirmationMatchesIntent(intent, [tx])
    ).not.toThrow();
  });

  it('throws RateConfirmationMismatchError when chainID does not match fromChainId', () => {
    const tx = makeTransaction({ chainID: '999', account: '0xSender' });
    expect(() => assertRateConfirmationMatchesIntent(intent, [tx])).toThrow(
      RateConfirmationMismatchError
    );
  });

  it('throws RateConfirmationMismatchError when account does not match sender (case-insensitive)', () => {
    const tx = makeTransaction({ account: '0xAttacker' });
    expect(() => assertRateConfirmationMatchesIntent(intent, [tx])).toThrow(
      RateConfirmationMismatchError
    );
  });

  it('does not throw when account matches sender case-insensitively', () => {
    const tx = makeTransaction({ account: '0xsender' });
    const intentLower = { fromChainId: '1', sender: '0xSENDER' };
    expect(() =>
      assertRateConfirmationMatchesIntent(intentLower, [tx])
    ).not.toThrow();
  });

  it('throws RateConfirmationMismatchError when MvX sender field does not match', () => {
    const tx = makeTransaction({ account: '0xSender', sender: 'erd1attacker' });
    const mvxIntent = { fromChainId: '1', sender: 'erd1legit' };
    expect(() => assertRateConfirmationMatchesIntent(mvxIntent, [tx])).toThrow(
      RateConfirmationMismatchError
    );
  });

  it('throws on the bad transaction when mixed valid and invalid transactions are present', () => {
    const goodTx = makeTransaction({ chainID: '1', account: '0xSender' });
    const badTx = makeTransaction({ chainID: '999', account: '0xSender' });
    expect(() =>
      assertRateConfirmationMatchesIntent(intent, [goodTx, badTx])
    ).toThrow(RateConfirmationMismatchError);
  });
});
