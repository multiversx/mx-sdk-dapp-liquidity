import { TokenType } from '../../../../types/token';
import { safeWindow } from '../../../constants';
import { getCompletePathname } from '../../../utils/getCompletePathname';
import { InitialTokensType } from '../../../utils/getInitialTokens';

export const updateUrlParams = ({
  firstTokenId,
  secondTokenId,
  callbackRoute,
  isTokensLoading,
  onNavigate
}: InitialTokensType & {
  callbackRoute: string;
  isTokensLoading: boolean;
  onNavigate?: (url: string, options?: object) => void;
}) => {
  if (isTokensLoading) {
    return;
  }

  const currentUrl = getCompletePathname();
  const searchParams = new URLSearchParams(safeWindow.location.search);

  if (firstTokenId) {
    searchParams.set('firstToken', firstTokenId);
  }

  if (secondTokenId) {
    searchParams.set('secondToken', secondTokenId);
  }

  const newUrl = `${callbackRoute}?${searchParams.toString()}`;

  if (currentUrl === newUrl) {
    return;
  }
  onNavigate?.(newUrl, { replace: true });
};

/**
 * Gets available tokens based on the source token and forced destination
 */
export const getAvailableTokens = (
  option: TokenType,
  targetTokens?: TokenType[],
  forcedDestinationTokenSymbol?: string
): TokenType[] => {
  if (forcedDestinationTokenSymbol) {
    const forcedToken = targetTokens?.find(
      (token) =>
        token.symbol.toLowerCase() ===
        forcedDestinationTokenSymbol.toLowerCase()
    );

    if (forcedToken) {
      return [forcedToken];
    }
    return [];
  }

  if (!option?.availableTokens) {
    return [];
  }

  const foundTokens: TokenType[] = [];

  for (const availableToken of option.availableTokens) {
    const foundToken = targetTokens?.find(
      (token) => token.address === availableToken.address
    );

    if (foundToken) {
      foundTokens.push(foundToken);
    }
  }

  return foundTokens;
};

/**
 * Gets the default receiving token (prefers USDC)
 */
export const getDefaultReceivingToken = (
  values: TokenType[],
  fallbackTokens?: TokenType[]
): TokenType | undefined => {
  return (
    values.find((x) => x.symbol.toLowerCase().includes('usdc')) ??
    fallbackTokens?.find((x) => x.symbol.toLowerCase().includes('usdc'))
  );
};
