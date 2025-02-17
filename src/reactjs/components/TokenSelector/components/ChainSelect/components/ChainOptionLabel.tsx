import AllNetworks from '../../../../../assets/all-networks.svg';
import { chainIdentifier, ChainNameType } from '../../../../../types/chains';

export interface ChainOptionLabelType {
  isDisabled?: boolean;
  inDropdown?: boolean;
  chain: {
    id: string;
    name: string;
    networkName: string;
    svgUrl?: string;
  };
}

export const ChainOptionLabel = ({
  chain,
  inDropdown = false
}: ChainOptionLabelType) => {
  const inDropdownClass = inDropdown ? 'in-dropdown' : 'hidden md:flex';

  return (
    <div
      className={`chain-element liq-flex liq-items-center liq-justify-between`}
    >
      <div className="liq-flex liq-flex-row liq-items-center">
        <div className={`chain-image liq-mr-2 ${inDropdownClass}`}>
          <div className="liq-h-6 liq-w-6 liq-flex-shrink-0 liq-overflow-hidden">
            {chain.svgUrl ? (
              <img
                src={
                  chainIdentifier[chain.name as ChainNameType] ?? chain.svgUrl
                }
                alt={''}
                loading="lazy"
                className="liq-h-full liq-w-full"
              />
            ) : (
              <img
                src={AllNetworks}
                alt={''}
                className="liq-h-full liq-w-full"
              />
            )}
          </div>
        </div>

        <div className="liq-flex liq-flex-col">
          <div className="liq-flex liq-items-center">
            <div
              className={
                'chain-name liq-flex liq-items-center liq-gap-2 liq-whitespace-nowrap'
              }
            >
              {chain.networkName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
