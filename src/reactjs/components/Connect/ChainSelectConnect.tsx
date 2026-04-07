import { useAppKit } from '@reown/appkit/react';
import { useState } from 'react';
import { ChainDTO } from '../../../dto/Chain.dto';
import { getDisplayName } from '../../../helpers/getDisplayName';
import { useWeb3App } from '../../context/useWeb3App';
import { useAccount } from '../../hooks/useAccount';
import { useSuiConnect } from '../../hooks/useSuiConnect';

const SUI_ICON =
  'https://raw.githubusercontent.com/MystenLabs/sui/main/docs/site/static/img/logo.svg';

const ChainSelectModal = ({
  activeChain,
  hasSui,
  onEvmSelect,
  onSuiSelect,
  onClose
}: {
  activeChain?: ChainDTO;
  hasSui: boolean;
  onEvmSelect: () => void;
  onSuiSelect: () => void;
  onClose: () => void;
}) => (
  <div
    className="liq-fixed liq-inset-0 liq-z-[9999] liq-flex liq-items-center liq-justify-center liq-bg-black/60"
    onClick={onClose}
  >
    <div
      className="liq-w-[340px] liq-rounded-2xl liq-bg-neutral-900 liq-border liq-border-neutral-700/40 liq-shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="liq-flex liq-items-center liq-justify-between liq-px-5 liq-py-4 liq-border-b liq-border-neutral-700/30">
        <h3 className="liq-text-white liq-text-base liq-font-semibold liq-m-0">
          Select Chain
        </h3>
        <button
          onClick={onClose}
          className="liq-text-neutral-400 hover:liq-text-white liq-text-lg liq-bg-transparent liq-border-none liq-cursor-pointer liq-p-1"
        >
          &times;
        </button>
      </div>
      <div className="liq-flex liq-flex-col liq-gap-2 liq-p-4">
        <button
          onClick={onEvmSelect}
          className="liq-flex liq-items-center liq-gap-3 liq-w-full liq-rounded-xl liq-bg-neutral-800/60 liq-px-4 liq-py-3 liq-text-left liq-text-white liq-font-medium liq-border liq-border-transparent liq-transition-all liq-duration-200 hover:liq-bg-neutral-750 hover:liq-border-neutral-600/50 liq-cursor-pointer"
        >
          {activeChain?.pngUrl && (
            <img
              src={activeChain.pngUrl}
              alt=""
              className="liq-w-8 liq-h-8 liq-rounded-full"
            />
          )}
          <div>
            <div className="liq-text-sm liq-font-semibold">
              {activeChain ? getDisplayName(activeChain) : 'Ethereum'}
            </div>
            <div className="liq-text-xs liq-text-neutral-400">EVM Chains</div>
          </div>
        </button>

        {hasSui && (
          <button
            onClick={onSuiSelect}
            className="liq-flex liq-items-center liq-gap-3 liq-w-full liq-rounded-xl liq-bg-neutral-800/60 liq-px-4 liq-py-3 liq-text-left liq-text-white liq-font-medium liq-border liq-border-transparent liq-transition-all liq-duration-200 hover:liq-bg-neutral-750 hover:liq-border-neutral-600/50 liq-cursor-pointer"
          >
            <img
              src={SUI_ICON}
              alt=""
              className="liq-w-8 liq-h-8 liq-rounded-full"
            />
            <div>
              <div className="liq-text-sm liq-font-semibold">Sui</div>
              <div className="liq-text-xs liq-text-neutral-400">
                Sui Network
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  </div>
);

export const ChainSelectConnect = ({
  activeChain,
  disabled,
  className
}: {
  activeChain?: ChainDTO;
  disabled?: boolean;
  className?: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  const { open } = useAppKit();
  const account = useAccount();
  const { options } = useWeb3App();
  const suiConnect = useSuiConnect();

  const hasSui = Boolean(options.suiEnvironment);

  if (account.isConnected || suiConnect.isConnected) {
    return null;
  }

  const handleEvmConnect = () => {
    setShowModal(false);
    open({ view: 'Connect', namespace: 'eip155' });
  };

  const handleSuiConnect = () => {
    setShowModal(false);
    suiConnect.connect();
  };

  if (!hasSui) {
    return (
      <button
        onClick={handleEvmConnect}
        disabled={disabled}
        className={`liq-font-bold liq-text-inherit liq-rounded-lg ${className ?? ''}`}
      >
        <div className="liq-flex liq-items-center liq-justify-center liq-gap-1">
          <span className="liq-text-primary-200">
            {account.isConnecting ? 'Connecting...' : 'Connect'}
          </span>
        </div>
      </button>
    );
  }

  return (
    <>
      {showModal && (
        <ChainSelectModal
          activeChain={activeChain}
          hasSui={hasSui}
          onEvmSelect={handleEvmConnect}
          onSuiSelect={handleSuiConnect}
          onClose={() => setShowModal(false)}
        />
      )}
      <button
        onClick={() => setShowModal(true)}
        disabled={disabled}
        className={`liq-font-bold liq-text-inherit liq-rounded-lg ${className ?? ''}`}
      >
        <div className="liq-flex liq-items-center liq-justify-center liq-gap-1">
          <span className="liq-text-primary-200">
            {account.isConnecting ? 'Connecting...' : 'Connect'}
          </span>
        </div>
      </button>
    </>
  );
};
