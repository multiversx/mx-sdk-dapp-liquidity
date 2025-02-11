import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ChainOptionLabelType {
  isDisabled?: boolean;
  inDropdown?: boolean;
  chain: {
    id: string;
    name: string;
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
          <div
            className={
              'liq-h-6 liq-w-6 liq-flex-shrink-0 liq-overflow-hidden liq-rounded-full'
            }
          >
            {chain.svgUrl ? (
              <img
                src={chain.svgUrl}
                alt={''}
                loading="lazy"
                className="liq-h-full liq-w-full"
              />
            ) : (
              <FontAwesomeIcon
                icon={faGlobe}
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
              {chain.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
