import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faWallet } from '@fortawesome/free-solid-svg-icons/faWallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { SelectContainer } from './components/SelectContainer';
import { SelectContent } from './components/SelectContent';
import { SelectedOption } from './components/SelectedOption';
import { MVX_CHAIN_IDS } from '../../../constants';
import { TokenType } from '../../../types/token';
import { useResolveTokenChain } from '../../hooks/useResolveTokenChain';
import { useGetChainsQuery } from '../../queries/useGetChains.query';
import { mxClsx } from '../../utils/mxClsx';
import { MxButton } from '../base/MxButton';
import { DisplayAmount } from '../DisplayAmount';

export const TokenSelector = ({
  name,
  options = [],
  selectedOption,
  areOptionsLoading = false,
  className = '',
  disabled = false,
  omitDisableClass = false,
  color = 'neutral-750',
  onBlur,
  onChange,
  onMaxBtnClick,
  onTokenSelectorDisplay
}: {
  name: string;
  options: TokenType[];
  selectedOption?: TokenType;
  areOptionsLoading?: boolean;
  disabled?: boolean;
  omitDisableClass?: boolean;
  className?: string;
  color?: 'neutral-750' | 'neutral-850';
  onChange: (option?: TokenType) => void;
  onBlur?: (e: React.FocusEvent<any, HTMLButtonElement>) => void;
  onMaxBtnClick?: () => void;
  onTokenSelectorDisplay?: (visible: boolean) => void;
}) => {
  const [show, setShow] = useState(false);

  const { data, isLoading: areChainsLoading } = useGetChainsQuery();
  const { chainIcon } = useResolveTokenChain({
    token: selectedOption
  });

  const chains = useMemo(() => {
    return (
      data?.filter(
        (chain) => !MVX_CHAIN_IDS.includes(Number(chain.chainId.toString()))
      ) ?? []
    );
  }, [data]);

  const handleOnClick = () => setShow(true);

  useEffect(() => {
    onTokenSelectorDisplay?.(show);
  }, [show]);

  if (areOptionsLoading || areChainsLoading) {
    return (
      <div
        className={mxClsx(
          'liq-h-12 liq-w-40 liq-animate-pulse',
          {
            'liq-rounded-xl': true,
            'liq-rounded-e-lg liq-rounded-s-3xl': true
          },
          {
            'liq-bg-neutral-100 liq-bg-opacity-[0.1] hover:liq-bg-opacity-[0.25]':
              color === 'neutral-750',
            'liq-bg-neutral-100 liq-bg-opacity-[0.05] hover:liq-bg-opacity-[0.15]':
              color === 'neutral-850'
          },
          className
        )}
      />
    );
  }

  return (
    <>
      {show && (
        <SelectContainer onClose={() => setShow(false)}>
          <SelectContent
            onSelect={(token) => {
              onChange(token);
              setShow(false);
            }}
            tokens={options}
            chains={chains}
            areChainsLoading={areChainsLoading}
            selectedToken={selectedOption}
          />
        </SelectContainer>
      )}

      {!show && (
        <div className="liq-flex liq-flex-col liq-items-end liq-justify-between liq-gap-4">
          <button
            name={name}
            type="button"
            role="combobox"
            className={mxClsx(
              'focus-primary liq-group liq-flex liq-cursor-pointer liq-items-center liq-gap-2 liq-transition-colors liq-duration-200 liq-relative',
              {
                'liq-rounded-e-lg liq-rounded-s-3xl liq-px-1 liq-py-1 liq-pr-3':
                  true
              },
              {
                'liq-bg-neutral-750/50 hover:enabled:liq-bg-neutral-750':
                  color === 'neutral-750',
                'liq-bg-neutral-900/50 liq-outline liq-outline-1 liq-outline-neutral-700/20 hover:enabled:liq-bg-neutral-600/50 hover:enabled:liq-outline-neutral-600':
                  color === 'neutral-850'
              },
              {
                'disabled:!liq-opacity-70': disabled && !omitDisableClass
              },
              {
                '!liq-cursor-not-allowed !liq-bg-transparent !liq-outline-transparent':
                  disabled
              },
              className
            )}
            onBlur={onBlur}
            onClick={handleOnClick}
            disabled={disabled}
          >
            <SelectedOption value={selectedOption} />

            {!disabled && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className="liq-text-neutral-200 group-hover:liq-text-neutral-50"
              />
            )}

            {chainIcon && (
              <img
                src={chainIcon}
                alt=""
                className="liq-absolute liq-left-6 liq-bottom-[2px] liq-chain-icon liq-sm liq-w-6 liq-h-6 liq-border-[3px] liq-border-neutral-850  liq-rounded-lg"
              />
            )}
          </button>
          <div className="liq-flex liq-items-center liq-gap-3">
            <div className="liq-flex liq-items-center liq-gap-3">
              <div className="liq-flex liq-items-center liq-gap-1">
                <FontAwesomeIcon
                  icon={faWallet}
                  className="liq-text-neutral-300"
                />
                <DisplayAmount
                  decimals={selectedOption?.decimals}
                  amount={selectedOption?.balance ?? '0'}
                  className="liq-font-medium liq-text-neutral-100"
                />
              </div>
              {onMaxBtnClick && (
                <MxButton
                  btnSize="xs"
                  variant="neutral-800"
                  disabled={disabled}
                  onClick={onMaxBtnClick}
                >
                  <span className="liq-text-neutral-300">MAX</span>
                </MxButton>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
