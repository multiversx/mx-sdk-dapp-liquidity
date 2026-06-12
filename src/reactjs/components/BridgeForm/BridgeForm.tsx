import { useEffect, useRef, useMemo, useState } from 'react';
import { getInitialTokens } from 'reactjs/utils';
import { Deposit } from './Deposit';
import { Transfer } from './Transfer';
import { MVX_CHAIN_IDS } from '../../../constants';
import { useWeb3App } from '../../context/useWeb3App';
import { useGetAllTokensQuery } from '../../queries/useGetAllTokens.query';
import { MxLoadSkeleton } from '../base/MxLoadSkeleton';

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
  const { bridgeOnly, nativeAuthToken } = useWeb3App();

  const { data: tokens, isLoading } = useGetAllTokensQuery({
    nativeAuthToken,
    bridgeOnly
  });

  const { firstTokenId } = getInitialTokens({
    firstTokenId: firstTokenIdentifier
  });

  const [direction, setDirection] = useState<'deposit' | 'withdraw'>('deposit');
  const [directionReady, setDirectionReady] = useState(!firstTokenId);

  const isFirstTokenMvx = useMemo(() => {
    if (!firstTokenId || !tokens || isLoading) {
      return false;
    }
    const match = tokens.find(
      (t) => t.address.toLowerCase() === firstTokenId.toLowerCase()
    );
    return Boolean(match && MVX_CHAIN_IDS.includes(match.chainId.toString()));
  }, [firstTokenId, tokens, isLoading]);

  const directionInitializedRef = useRef(false);

  useEffect(() => {
    if (directionInitializedRef.current || !tokens || isLoading) {
      return;
    }
    directionInitializedRef.current = true;
    if (isFirstTokenMvx) {
      setDirection('withdraw');
    }
    setDirectionReady(true);
  }, [tokens, isFirstTokenMvx, isLoading]);

  const handleChangeDirection = () => {
    // Prevent direction change when bridgeOnly is false
    if (bridgeOnly === false) {
      return;
    }

    setDirection((prevState) => {
      return prevState === 'deposit' ? 'withdraw' : 'deposit';
    });
  };

  if (!directionReady) {
    return <MxLoadSkeleton />;
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
