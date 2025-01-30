import { formatAmount as dappCoreFormatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { stringIsInteger } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsInteger';
import { roundAmount } from './roundAmount';

export const formatAmount = ({
  amount = '0',
  decimals = 0,
  addCommas = false,
  digits = 4,
  showLastNonZeroDecimal = true
}: {
  digits?: number;
  decimals?: number;
  addCommas?: boolean;
  amount?: string | null;
  showLastNonZeroDecimal?: boolean;
}) => {
  if (amount == null || amount === '0' || !stringIsInteger(amount, false)) {
    return '0';
  }

  const formattedAmount = dappCoreFormatAmount({
    decimals,
    input: amount,
    showLastNonZeroDecimal
  });

  return roundAmount(formattedAmount, digits, addCommas);
};
