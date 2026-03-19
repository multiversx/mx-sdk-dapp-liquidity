import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const XPORTAL_WALLET_ID =
  '4119a5b3e5ebc809b6a3680a280ae517b92fead02e4c07b7cec0d3385c87aee2';
const XPORTAL_DEEPLINK = 'https://xport.al/wc?uri=';

export const SuiConnectModal = ({
  uri,
  onClose
}: {
  uri: string;
  onClose: () => void;
}) => {
  const [view, setView] = useState<'wallets' | 'qr'>('wallets');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleXPortal = () => {
    window.open(`${XPORTAL_DEEPLINK}${encodeURIComponent(uri)}`, '_blank');
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="liq-fixed liq-inset-0 liq-z-[99999] liq-flex liq-items-center liq-justify-center liq-bg-black/60"
      onClick={onClose}
    >
      <div
        className="liq-w-[360px] liq-rounded-3xl liq-bg-[#1b1b1f] liq-shadow-2xl liq-overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="liq-flex liq-items-center liq-justify-between liq-px-5 liq-py-4">
          {view === 'qr' ? (
            <button
              onClick={() => setView('wallets')}
              className="liq-text-neutral-400 hover:liq-text-white liq-bg-transparent liq-border-none liq-cursor-pointer liq-text-sm"
            >
              &larr; Back
            </button>
          ) : (
            <div />
          )}
          <span className="liq-text-white liq-text-sm liq-font-semibold">
            Connect Wallet
          </span>
          <button
            onClick={onClose}
            className="liq-text-neutral-400 hover:liq-text-white liq-text-lg liq-bg-transparent liq-border-none liq-cursor-pointer"
          >
            &times;
          </button>
        </div>

        {view === 'wallets' && (
          <div className="liq-flex liq-flex-col liq-px-3 liq-pb-5">
            {/* WalletConnect QR */}
            <button
              onClick={() => setView('qr')}
              className="liq-flex liq-items-center liq-gap-3 liq-w-full liq-rounded-xl liq-px-3 liq-py-3 liq-text-left liq-text-white liq-bg-transparent liq-border-none liq-transition-colors liq-duration-150 hover:liq-bg-[#2a2a2f] liq-cursor-pointer"
            >
              <img
                src="https://explorer-api.walletconnect.com/v3/logo/lg/09422b5b-3b53-4786-90b4-5765e498db00?projectId=2f05ae7f1116030fde2d36508f472bfb"
                alt=""
                className="liq-w-10 liq-h-10 liq-rounded-lg"
              />
              <span className="liq-flex-1 liq-text-sm liq-font-medium">
                WalletConnect
              </span>
              <span className="liq-text-xs liq-text-[#47a1ff] liq-font-medium liq-border liq-border-[#47a1ff]/30 liq-rounded-md liq-px-2 liq-py-0.5">
                QR CODE
              </span>
              <span className="liq-text-neutral-500">&rsaquo;</span>
            </button>

            {/* xPortal */}
            <button
              onClick={handleXPortal}
              className="liq-flex liq-items-center liq-gap-3 liq-w-full liq-rounded-xl liq-px-3 liq-py-3 liq-text-left liq-text-white liq-bg-transparent liq-border-none liq-transition-colors liq-duration-150 hover:liq-bg-[#2a2a2f] liq-cursor-pointer"
            >
              <img
                src={`https://explorer-api.walletconnect.com/v3/logo/lg/afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7?projectId=2f05ae7f1116030fde2d36508f472bfb`}
                alt=""
                className="liq-w-10 liq-h-10 liq-rounded-lg"
              />
              <span className="liq-flex-1 liq-text-sm liq-font-medium">
                xPortal
              </span>
              <span className="liq-text-neutral-500">&rsaquo;</span>
            </button>
          </div>
        )}

        {view === 'qr' && (
          <div className="liq-flex liq-flex-col liq-items-center liq-px-5 liq-pb-5 liq-gap-3">
            <p className="liq-text-neutral-400 liq-text-xs liq-m-0">
              Scan with your wallet
            </p>
            <div className="liq-bg-white liq-rounded-2xl liq-p-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(uri)}`}
                alt="QR Code"
                className="liq-w-[260px] liq-h-[260px]"
              />
            </div>
            <button
              onClick={handleCopy}
              className="liq-flex liq-items-center liq-gap-2 liq-text-xs liq-text-[#47a1ff] liq-bg-transparent liq-border liq-border-[#47a1ff]/30 liq-rounded-lg liq-px-4 liq-py-2 liq-cursor-pointer hover:liq-bg-[#47a1ff]/10 liq-transition-colors"
            >
              <FontAwesomeIcon icon={faCopy} />
              {copied ? 'Copied!' : 'Copy URI'}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="liq-flex liq-justify-center liq-py-3 liq-border-t liq-border-[#2a2a2f]">
          <span className="liq-text-neutral-500 liq-text-xs">
            UX by <span className="liq-text-neutral-400">reown</span>
          </span>
        </div>
      </div>
    </div>
  );
};
