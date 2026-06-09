import { useEffect, useState } from 'react';
import { useFetchBridgeData } from 'reactjs/hooks';
import { getInitialTokens } from 'reactjs/utils';
import { Deposit } from './Deposit';
import { Transfer } from './Transfer';
import { isTokenIdFromMvx } from './utils/bridgeFormHelpers';
import { useWeb3App } from '../../context/useWeb3App';
import { MxCircleLoader } from '../base/MxCircleLoader';

interface BridgeFormProps {
  mvxChainId: string;
  mvxAddress?: string;
  username?: string;
  callbackRoute?: string;
  firstTokenIdentifier?: string;
  secondTokenIdentifier?: string;
  firstTokenAmount?: string;
  secondTokenAmount?: string;
  refetchTrigger?: number;
  showHistory?: boolean;
  forcedDestinationTokenSymbol?: string;
  onSuccessfullySentTransaction?: (txHashes?: string[]) => void;
  onFailedSentTransaction?: (message?: string) => void;
  onSuccessfullySentMvxTransaction?: (txHashes?: string[]) => void;
  onFailedSentMvxTransaction?: (message?: string) => void;
  onHistoryClose?: () => void;
  onMvxConnect: () => void;
  onMvxDisconnect?: () => void;
  /**
   * Called after the SDK updates the URL with token query params.
   * The SDK always calls `history.replaceState` first, so the URL is already
   * updated client-side. This callback is purely informational — pass a
   * soft client-side router (e.g. Next.js `router.replace`) so your framework
   * stays in sync. Do NOT use `window.location.assign` or any hard navigation:
   * that will cause an infinite reload loop when an injected EVM provider
   * (MetaMask, etc.) auto-connects on mount.
   */
  onNavigate?: (url: string, options?: object) => void;
}

export const BridgeForm = ({
  mvxChainId,
  mvxAddress,
  username,
  callbackRoute = '/',
  firstTokenIdentifier,
  secondTokenIdentifier,
  firstTokenAmount,
  secondTokenAmount,
  refetchTrigger,
  showHistory,
  forcedDestinationTokenSymbol,
  onSuccessfullySentTransaction,
  onSuccessfullySentMvxTransaction,
  onFailedSentMvxTransaction,
  onFailedSentTransaction,
  onMvxConnect,
  onMvxDisconnect,
  onHistoryClose,
  onNavigate
}: BridgeFormProps) => {
  const { bridgeOnly, options } = useWeb3App();
  const { firstTokenId, secondTokenId } = getInitialTokens({
    firstTokenId: firstTokenIdentifier,
    secondTokenId: secondTokenIdentifier
  });

  const [direction, setDirection] = useState<
    'deposit' | 'withdraw' | undefined
  >(undefined);

  const {
    isTokensLoading: tokensLoading,
    isLoadingEvmTokensBalances,
    isLoadingMvxTokensBalances,
    isChainsLoading,
    mvxTokensWithBalances
  } = useFetchBridgeData({
    refetchTrigger,
    mvxAddress,
    mvxApiURL: options.mvxApiURL
  });

  const handleChangeDirection = () => {
    // Prevent direction change when bridgeOnly is false
    if (bridgeOnly === false) {
      return;
    }

    setDirection((prevState) => {
      return prevState === 'deposit' ? 'withdraw' : 'deposit';
    });
  };

  const isTokensLoading =
    tokensLoading ||
    isLoadingEvmTokensBalances ||
    isLoadingMvxTokensBalances ||
    isChainsLoading;

  // Resolve direction once token lists are available.
  // Only fires when direction is still undefined (i.e. once, on first successful load).
  useEffect(() => {
    if (isTokensLoading || direction !== undefined) {
      return;
    }
    // Deposit-only mode: never auto-switch to withdraw.
    if (bridgeOnly === false) {
      setDirection('deposit');
      return;
    }
    const isWithdraw =
      Boolean(firstTokenId) &&
      Boolean(secondTokenId) &&
      isTokenIdFromMvx(firstTokenId, mvxTokensWithBalances);
    setDirection(isWithdraw ? 'withdraw' : 'deposit');
  }, [
    isTokensLoading,
    direction,
    bridgeOnly,
    firstTokenId,
    secondTokenId,
    mvxTokensWithBalances
  ]);

  if (isTokensLoading || direction === undefined) {
    return <MxCircleLoader />;
  }

  if (direction === 'withdraw') {
    return (
      <Transfer
        mvxChainId={mvxChainId}
        mvxAddress={mvxAddress}
        username={username}
        callbackRoute={callbackRoute}
        firstTokenIdentifier={firstTokenIdentifier}
        secondTokenIdentifier={secondTokenIdentifier}
        firstTokenAmount={firstTokenAmount}
        secondTokenAmount={secondTokenAmount}
        refetchTrigger={refetchTrigger}
        showHistory={showHistory}
        forcedDestinationTokenSymbol={forcedDestinationTokenSymbol}
        direction={direction}
        onChangeDirection={handleChangeDirection}
        onSuccessfullySentTransaction={onSuccessfullySentMvxTransaction}
        onFailedSentTransaction={onFailedSentMvxTransaction}
        onHistoryClose={onHistoryClose}
        onMvxConnect={onMvxConnect}
        onMvxDisconnect={onMvxDisconnect}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <Deposit
      mvxChainId={mvxChainId}
      mvxAddress={mvxAddress}
      username={username}
      callbackRoute={callbackRoute}
      firstTokenIdentifier={firstTokenIdentifier}
      secondTokenIdentifier={secondTokenIdentifier}
      firstTokenAmount={firstTokenAmount}
      secondTokenAmount={secondTokenAmount}
      refetchTrigger={refetchTrigger}
      showHistory={showHistory}
      forcedDestinationTokenSymbol={forcedDestinationTokenSymbol}
      direction={direction}
      onChangeDirection={handleChangeDirection}
      onSuccessfullySentTransaction={onSuccessfullySentTransaction}
      onFailedSentTransaction={onFailedSentTransaction}
      onHistoryClose={onHistoryClose}
      onMvxConnect={onMvxConnect}
      onMvxDisconnect={onMvxDisconnect}
      onNavigate={onNavigate}
    />
  );
};
