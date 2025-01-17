import BigNumber from 'bignumber.js';
import { removeCommas } from './removeCommas';

export const getCleanStringAmount = (amount: string) => {
  // removes commas because new BigNumber("100,123,122.34").toString(10) returns NAN
  const amountWithoutCommas = removeCommas(amount);

  // amount string cannot be parseFloat if it has too many decimals
  // transforms 100.1212121212121221 -> 100.121212121
  const validFloatString = new BigNumber(amountWithoutCommas).toString(10);
  const parts = validFloatString.split('.');

  return { amountWithoutCommas, parts };
};
