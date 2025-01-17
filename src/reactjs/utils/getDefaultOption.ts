import { TokenType } from '../../types/token';

export const getDefaultOption = (option?: TokenType) => {
  if (!option) {
    return;
  }

  return {
    token: option,
    value: option.address,
    label: option.symbol
  };
};
