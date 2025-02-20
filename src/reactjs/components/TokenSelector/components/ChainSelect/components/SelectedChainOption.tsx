import { components, type SingleValueProps } from 'react-select';
import AllNetworks from '../../../../../assets/all-networks.svg';
import { chainIdentifier, ChainNameType } from '../../../../../types/chains';
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
        className="liq-w-full liq-flex liq-justify-between liq-items-center liq-cursor-pointer"
        onClick={onMenuOpen}
      >
        {chain?.svgUrl ? (
          <img
            src={chain.svgUrl ?? chainIdentifier[chain.name as ChainNameType]}
            alt={''}
            loading="lazy"
            className="liq-h-full liq-w-full"
          />
        ) : (
          <img src={AllNetworks} alt={''} className="liq-h-full liq-w-full" />
        )}
      </div>
    </components.SingleValue>
  );
};
