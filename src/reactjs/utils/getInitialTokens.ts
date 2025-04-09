import { safeWindow } from '../constants';

export interface InitialTokensType {
  firstTokenId?: string;
  secondTokenId?: string;
}

export const getInitialTokens = (initialTokens?: {
  firstTokenId?: string;
  secondTokenId?: string;
}) => {
  const urlParams = new URLSearchParams(safeWindow.location.search);
  const { firstToken, secondToken } = Object.fromEntries(urlParams);

  return {
    firstTokenId: initialTokens?.firstTokenId || firstToken,
    secondTokenId: initialTokens?.secondTokenId || secondToken
  };
};
