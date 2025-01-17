import numeral from 'numeral';
import { removeCommas } from '../../../utils/removeCommas';

export const truncateAmount = (formattedAmount: string) => {
  const cleanFormattedAmount = removeCommas(formattedAmount);
  const number = Number(cleanFormattedAmount);

  const abbreviations: { [key: string]: number } = {
    T: 1e12,
    B: 1e9,
    M: 1e6,
    K: 1e3
  };

  for (const key in abbreviations) {
    if (Math.abs(number) >= abbreviations[key]) {
      return numeral(number / abbreviations[key]).format('0.[00]') + key;
    }
  }

  return number;
};
