import { components, type SingleValueProps } from 'react-select';
import { mxClsx } from 'reactjs/utils';
import AllNetworks from '../../../../../assets/all-networks.svg';
import {
  ALL_NETWORK_ID,
  chainIdentifier,
  ChainNameType
} from '../../../../../constants';
import { PartialChainOptionType } from '../types/partialChainOption';

export const SelectedChainOption = ({
  ...props
}: SingleValueProps<PartialChainOptionType>) => {
  const {
    selectProps: { onMenuOpen },
    data: { chain }
  } = props;

  return (
    <components.SingleValue {...props}>
      <div
        className="liq-h-6 liq-w-6 liq-flex liq-justify-between liq-items-center liq-cursor-pointer"
        onClick={onMenuOpen}
      >
        {chain?.pngUrl ? (
          <img
            src={chain.pngUrl ?? chainIdentifier[chain.name as ChainNameType]}
            alt={''}
            loading="lazy"
            className={mxClsx('liq-h-full liq-w-full', {
              'liq-rounded-lg': chain?.id !== ALL_NETWORK_ID
            })}
          />
        ) : (
          <img src={AllNetworks} alt={''} className="liq-h-full liq-w-full" />
        )}
      </div>
    </components.SingleValue>
  );
};
