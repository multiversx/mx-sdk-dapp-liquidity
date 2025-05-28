import { useState } from 'react';
import { Deposit } from './Deposit.tsx';
import { Transfer } from './Transfer.tsx';

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
  onHistoryClose?: () => void;
  onMvxConnect: () => void;
  onMvxDisconnect?: () => void;
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
  onFailedSentTransaction,
  onMvxConnect,
  onMvxDisconnect,
  onHistoryClose,
  onNavigate
}: BridgeFormProps) => {
  const [direction, setDirection] = useState<'deposit' | 'withdraw'>('deposit');

  const handleChangeDirection = () => {
    setDirection((prevState) =>
      prevState === 'deposit' ? 'withdraw' : 'deposit'
    );
  };

  return direction === 'deposit' ? (
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
  ) : (
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
      onSuccessfullySentTransaction={onSuccessfullySentTransaction}
      onFailedSentTransaction={onFailedSentTransaction}
      onHistoryClose={onHistoryClose}
      onMvxConnect={onMvxConnect}
      onMvxDisconnect={onMvxDisconnect}
      onNavigate={onNavigate}
    />
  );
};
