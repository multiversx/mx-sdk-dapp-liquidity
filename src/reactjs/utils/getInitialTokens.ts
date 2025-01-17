export interface InitialTokensType {
  firstTokenId?: string;
  secondTokenId?: string;
}

export const getInitialTokens = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const { firstToken, secondToken } = Object.fromEntries(urlParams);

  return {
    firstTokenId: firstToken,
    secondTokenId: secondToken
  };
};
