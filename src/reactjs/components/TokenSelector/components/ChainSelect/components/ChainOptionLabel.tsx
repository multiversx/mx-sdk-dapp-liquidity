import { mxClsx } from '../../../../../utils/mxClsx';

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
    <div className={`chain-element flex items-center justify-between`}>
      <div className="flex flex-row items-center">
        <div className={`chain-image mr-2 ${inDropdownClass}`}>
          <div
            className={mxClsx(
              'h-6 w-6 flex-shrink-0 overflow-hidden rounded-full'
            )}
          >
            <img
              src={chain.svgUrl}
              alt={''}
              loading="lazy"
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center">
            <div
              className={mxClsx(
                'chain-name flex items-center gap-2 whitespace-nowrap'
              )}
            >
              {chain.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
