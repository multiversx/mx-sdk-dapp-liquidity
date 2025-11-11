import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChainDTO } from '../../../../dto/Chain.dto';
import { TokenType } from '../../../../types/token';
import { getInitialTokens } from '../../../utils/getInitialTokens';
import * as BridgeFormHelpers from '../utils/bridgeFormHelpers';

interface UseBridgeTokenSelectionProps {
  chains?: ChainDTO[];
  firstTokenIdentifier?: string;
  secondTokenIdentifier?: string;
  fromTokens?: TokenType[];
  toTokens?: TokenType[];
  isTokensLoading: boolean;
  activeChainId?: string;
  mvxChainId?: string;
  callbackRoute: string;
  forcedDestinationTokenSymbol?: string;
  onNavigate?: (url: string, options?: object) => void;
  switchNetwork?: (chain: { id: string | number }) => void;
  sdkChains?: Array<{ id: string | number; chainId?: string }>;
  activeChain?: { id: string | number };
}

export const useBridgeTokenSelection = ({
  chains,
  firstTokenIdentifier,
  secondTokenIdentifier,
  fromTokens,
  toTokens,
  isTokensLoading,
  activeChainId,
  mvxChainId,
  callbackRoute,
  forcedDestinationTokenSymbol,
  onNavigate,
  switchNetwork,
  sdkChains,
  activeChain
}: UseBridgeTokenSelectionProps) => {
  const initializedInitialTokensRef = useRef(false);
  const [firstToken, setFirstToken] = useState<TokenType | undefined>();
  const [secondToken, setSecondToken] = useState<TokenType | undefined>();

  const fromOptions = useMemo(
    () =>
      fromTokens
        ?.filter((token) => {
          // If mvxChainId is provided, only show tokens from that chain
          if (mvxChainId) {
            return (
              token.chainId.toString().toLowerCase() ===
              mvxChainId.toString().toLowerCase()
            );
          }
          return true;
        })
        .map((token) => ({
          ...token,
          identifier: token.address,
          ticker: token.symbol
        })) ?? [],
    [fromTokens, mvxChainId]
  );

  const getAvailableTokens = useCallback(
    (option: TokenType) =>
      BridgeFormHelpers.getAvailableTokens(
        option,
        toTokens,
        forcedDestinationTokenSymbol
      ),
    [toTokens, forcedDestinationTokenSymbol]
  );

  const toOptions = useMemo(() => {
    if (!firstToken) {
      return [];
    }

    return (
      toTokens
        ?.filter(
          (token) =>
            token.symbol.toLowerCase() === firstToken.symbol.toLowerCase()
        )
        .map((token) => ({
          ...token,
          identifier: token.address,
          ticker: token.symbol
        })) ?? []
    );
  }, [firstToken?.symbol, toTokens]);

  const selectedChainOption = useMemo(
    () =>
      chains?.find(
        (option) => option.chainId.toString() === activeChain?.id.toString()
      ) ?? chains?.[0],
    [activeChain?.id, chains]
  );

  const getDefaultReceivingToken = useCallback(
    (values: TokenType[]) =>
      BridgeFormHelpers.getDefaultReceivingToken(values, toTokens),
    [toTokens]
  );

  const updateUrlParams = useCallback(
    ({
      firstTokenId,
      secondTokenId
    }: {
      firstTokenId?: string;
      secondTokenId?: string;
    }) => {
      BridgeFormHelpers.updateUrlParams({
        firstTokenId,
        secondTokenId,
        callbackRoute,
        isTokensLoading,
        onNavigate
      });
    },
    [callbackRoute, isTokensLoading, onNavigate]
  );

  const onChangeFirstSelect = useCallback(
    (option?: TokenType) => {
      if (!option) {
        return;
      }

      setFirstToken(option);
      updateUrlParams({ firstTokenId: option.address });

      // First try to find matching token by symbol directly in toTokens
      let secondOption = toTokens?.find(
        (x) => x.symbol.toLowerCase() === option.symbol.toLowerCase()
      );

      // If not found, use availableTokens and find by symbol
      if (!secondOption) {
        const availableTokens = getAvailableTokens(option);
        secondOption =
          availableTokens.find(
            (x) => x.symbol.toLowerCase() === option.symbol.toLowerCase()
          ) ?? getDefaultReceivingToken(availableTokens);
      }

      if (secondOption) {
        setSecondToken(secondOption);
        updateUrlParams({ secondTokenId: secondOption.address });
      }
    },
    [getAvailableTokens, getDefaultReceivingToken, updateUrlParams, toTokens]
  );

  const onChangeSecondSelect = useCallback(
    (option?: TokenType) => {
      if (!option) {
        return;
      }

      setSecondToken(option);
      updateUrlParams({ secondTokenId: option.address });

      const firstOption = fromOptions.find(
        (x) => x.symbol.toLowerCase() === option.symbol.toLowerCase()
      );

      if (firstOption) {
        setFirstToken(firstOption);
        updateUrlParams({ firstTokenId: firstOption.address });
      }
    },
    [fromOptions, updateUrlParams]
  );

  const handleChangeDirection = useCallback(() => {
    if (!firstToken || !secondToken) {
      return;
    }

    // Swap the tokens
    setFirstToken(secondToken);
    setSecondToken(firstToken);

    updateUrlParams({
      firstTokenId: secondToken.address,
      secondTokenId: firstToken.address
    });

    // Switch to the network of the new firstToken (which is current secondToken)
    const selectedOptionChain = sdkChains?.find(
      (chain) => chain.id.toString() === secondToken.chainId.toString()
    );

    if (selectedOptionChain && switchNetwork) {
      switchNetwork(selectedOptionChain);
    }
  }, [firstToken, secondToken, updateUrlParams, sdkChains, switchNetwork]);

  // Initialize token selection
  useEffect(() => {
    if (
      isTokensLoading ||
      initializedInitialTokensRef.current ||
      !fromOptions.length
    ) {
      return;
    }

    // Don't reinitialize if tokens are already properly set
    if (firstToken && secondToken) {
      initializedInitialTokensRef.current = true;
      return;
    }

    const initialTokens = getInitialTokens({
      firstTokenId: firstTokenIdentifier,
      secondTokenId: secondTokenIdentifier
    });

    const firstOption =
      fromOptions.find(
        ({ identifier }) => initialTokens?.firstTokenId === identifier
      ) ??
      fromOptions.find(
        (option) => option.chainId.toString() === activeChainId?.toString()
      ) ??
      fromOptions[0];

    // Try to find matching token by symbol first in toTokens
    let secondOption = toTokens?.find(
      (x) => x.symbol.toLowerCase() === firstOption?.symbol.toLowerCase()
    );

    // Fallback to availableTokens logic if not found
    if (!secondOption) {
      const availableTokens = getAvailableTokens(firstOption);
      secondOption =
        availableTokens?.find(
          ({ address }) =>
            address.toLowerCase() ===
            (firstOption?.symbol ?? initialTokens?.secondTokenId)?.toLowerCase()
        ) ??
        availableTokens.find(
          (x) => x.symbol.toLowerCase() === firstOption?.symbol.toLowerCase()
        ) ??
        getDefaultReceivingToken(availableTokens);
    }

    const hasOptionsSelected =
      Boolean(firstToken) &&
      Boolean(secondToken) &&
      firstToken?.address?.toLowerCase() ===
        firstOption?.address?.toLowerCase() &&
      secondToken?.address?.toLowerCase() ===
        secondOption?.address?.toLowerCase();

    if (hasOptionsSelected) {
      return;
    }

    let initialized = false;
    if (firstOption) {
      setFirstToken(firstOption);
      updateUrlParams({ firstTokenId: firstOption.address });

      const selectedOptionChain =
        sdkChains?.find(
          (chain) => chain.id.toString() === firstOption.chainId.toString()
        ) ?? activeChain;

      if (selectedOptionChain && switchNetwork) {
        switchNetwork(selectedOptionChain);
      }
      initialized = true;
    }

    if (secondOption) {
      setSecondToken(secondOption);
      updateUrlParams({ secondTokenId: secondOption.address });
      initialized = initialized && true;
    }

    initializedInitialTokensRef.current = initialized;
  }, [
    isTokensLoading,
    fromOptions,
    toTokens,
    firstTokenIdentifier,
    secondTokenIdentifier,
    activeChainId,
    getAvailableTokens,
    getDefaultReceivingToken,
    updateUrlParams,
    sdkChains,
    activeChain,
    switchNetwork,
    firstToken,
    secondToken
  ]);

  // Update balances when they change
  useEffect(() => {
    const selectedTokenOption = fromTokens?.find(
      (x) => x.address === firstToken?.address
    );
    if (selectedTokenOption) {
      setFirstToken((prev) => {
        return prev ? { ...prev, balance: selectedTokenOption.balance } : prev;
      });
    }
  }, [fromTokens, firstToken?.address]);

  useEffect(() => {
    const selectedTokenOption = toTokens?.find(
      (x) => x.address === secondToken?.address
    );
    if (selectedTokenOption) {
      setSecondToken((prev) => {
        return prev ? { ...prev, balance: selectedTokenOption.balance } : prev;
      });
    }
  }, [toTokens, secondToken?.address]);

  return {
    firstToken,
    secondToken,
    fromOptions,
    toOptions,
    selectedChainOption,
    setFirstToken,
    setSecondToken,
    onChangeFirstSelect,
    onChangeSecondSelect,
    handleChangeDirection,
    updateUrlParams
  };
};
