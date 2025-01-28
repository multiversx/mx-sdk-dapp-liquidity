import BigNumber from 'bignumber.js';
import { parseAmount } from './parseAmount';
import { testNumber } from './testNumber';

export function hasEnoughFunds({
  balance,
  amount,
  decimals
}: {
  balance: string;
  amount: string;
  decimals: number;
}) {
  const isNumber = testNumber(amount);

  const bnBalance = new BigNumber(balance);
  const bnAmount = new BigNumber(
    parseAmount(isNumber ? amount : '0', decimals)
  );

  const notEnough = !bnBalance.isNegative() && bnBalance.lt(bnAmount);

  return !notEnough;
}
