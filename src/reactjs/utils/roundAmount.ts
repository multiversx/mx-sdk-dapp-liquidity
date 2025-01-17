import BigNumber from 'bignumber.js';
import { isStringFloat } from './isStringFloat';

export const roundAmount = (
  amount: string,
  digits?: number,
  addCommas?: boolean
) => {
  const digitsToUse = digits ?? 4;
  const cleanAmount = isStringFloat(amount) ? amount : '0';

  const bnAmount = new BigNumber(cleanAmount);

  if (bnAmount.isZero()) {
    return '0';
  }

  if (bnAmount.isInteger()) {
    return addCommas
      ? bnAmount.toFormat(digitsToUse, BigNumber.ROUND_FLOOR)
      : bnAmount.toFixed(digitsToUse);
  }

  const numStr = bnAmount.toFixed();
  const [intPart, decPart] = numStr.split('.');

  if (!decPart) {
    return intPart;
  }

  let nonZeroCount = 0;
  let resultDecPart = '';

  for (let i = 0; i < decPart.length; i++) {
    if (digitsToUse === 0) {
      break;
    }

    resultDecPart += decPart[i];

    if (decPart[i] !== '0' || nonZeroCount > 0) {
      nonZeroCount++;
    }

    if (nonZeroCount === digitsToUse) {
      break;
    }
  }

  let resultIntPart = intPart;

  if (addCommas) {
    resultIntPart = new BigNumber(intPart).toFormat(0, BigNumber.ROUND_FLOOR);
  }

  return resultIntPart + (resultDecPart ? '.' + resultDecPart : '');
};
