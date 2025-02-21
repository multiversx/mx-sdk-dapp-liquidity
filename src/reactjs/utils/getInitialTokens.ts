import { safeWindow } from '../constants';

export interface InitialTokensType {
  firstTokenId?: string;
  secondTokenId?: string;
}

export const getInitialTokens = () => {
  const urlParams = new URLSearchParams(safeWindow.location.search);
  const { firstToken, secondToken } = Object.fromEntries(urlParams);

  return {
    firstTokenId: firstToken,
    secondTokenId: secondToken
  };
};
