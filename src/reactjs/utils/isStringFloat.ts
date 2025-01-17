import BigNumber from 'bignumber.js';

export const isStringFloat = (amount: string) => {
  if (amount.match(/^-*[0-9]*\.?[0-9]*$/) === null) {
    return false;
  }

  if (isNaN(parseFloat(amount))) {
    return false;
  }

  // eslint-disable-next-line prefer-const
  let [wholes, decimals] = amount.split('.');

  if (decimals) {
    while (decimals.charAt(decimals.length - 1) === '0') {
      decimals = decimals.slice(0, -1);
    }
  }

  const number = decimals ? [wholes, decimals].join('.') : wholes;

  const bNparsed = new BigNumber(number);
  // disabled because we show negative energy now
  // return bNparsed.toFixed() === number && bNparsed.comparedTo(0) >= 0;

  return bNparsed.toFixed() === number;
};
