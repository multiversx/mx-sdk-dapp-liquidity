import { ChainType } from '../../../../types/chainType';
import { TokenType } from '../../../../types/token';
import { ServerTransaction } from '../../../../types/transaction';
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

/** Prefer server transaction shape so signing matches the API even if chain metadata is stale. */
export function resolveSigningChainType(
  transaction: ServerTransaction,
  fallbackChain?: { chainType?: ChainType }
): ChainType | undefined {
  if (
    transaction.suiParams?.transactionBytes &&
    transaction.suiParams?.sender
  ) {
    return ChainType.sui;
  }
  if (transaction.instructions && transaction.feePayer) {
    return ChainType.sol;
  }
  if (transaction.bitcoinParams) {
    return ChainType.btc;
  }
  if (transaction.to && transaction.data !== undefined) {
    return ChainType.evm;
  }
  return fallbackChain?.chainType;
}

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
