import { useMemo } from 'react';
import Select from 'react-select';
import { FormatChainOptionLabel } from './components/FormatChainOptionLabel';
import { IndicatorSeparator } from './components/IndicatorSeparator';
import { ChainDTO } from '../../../../../dto/Chain.dto';

type PartialChainOptionType = {
  label: string;
  value: string;
  chain: {
    id: string;
    name: string;
    svgUrl: string;
  };
};

export const ChainSelect = ({
  isLoading,
  selectedChainId,
  onChange,
  chains
}: {
  isLoading?: boolean;
  selectedChainId?: string;
  onChange?: (chainId: string) => void;
  chains: ChainDTO[];
}) => {
  const chainOptions = useMemo(() => {
    const options: PartialChainOptionType[] = chains.map((chain) => ({
      label: chain.chainName,
      value: chain.chainId.toString(),
      chain: {
        id: chain.chainId.toString(),
        name: chain.chainName,
        svgUrl: chain.svgUrl
      }
    }));

    options.unshift({
      label: 'All',
      value: '0',
      chain: {
        id: '0',
        name: 'All',
        svgUrl: ''
      }
    });

    return options;
  }, [chains]);

  const selectedChain = useMemo(() => {
    return (
      chainOptions.find(
        (chainOption) =>
          chainOption.value.toString() === selectedChainId?.toString()
      ) ?? chainOptions?.[0]
    );
  }, [chainOptions, selectedChainId]);

  return (
    <div className={`styled-chain-select min-w-36`} data-testid="chainDropdown">
      <Select
        className="basic-single"
        classNamePrefix="styled-chain-select"
        maxMenuHeight={260}
        value={selectedChain}
        isLoading={isLoading}
        styles={{
          indicatorSeparator: IndicatorSeparator,
          control: (css) => ({
            ...css,
            width: 'max-content',
            minWidth: '100%'
          }),
          menu: (css) => ({
            ...css,
            zIndex: 9999,
            width: 'max-content',
            minWidth: '100%',
            right: 0
          })
        }}
        isSearchable={true}
        name="chain"
        options={chainOptions}
        onChange={(selectedOption) => {
          if (selectedOption?.chain.id) {
            onChange?.(selectedOption.chain.id.toString());
          }
        }}
        formatOptionLabel={FormatChainOptionLabel}
      />
    </div>
  );
};
