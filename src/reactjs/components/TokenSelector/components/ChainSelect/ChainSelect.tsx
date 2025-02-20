import { useMemo } from 'react';
import Select from 'react-select';
import { FormatChainOptionLabel } from './components/FormatChainOptionLabel';
import { IndicatorSeparator } from './components/IndicatorSeparator';
import { SelectedChainOption } from './components/SelectedChainOption';
import { PartialChainOptionType } from './types/partialChainOption';
import { ChainDTO } from '../../../../../dto/Chain.dto';

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
      label: chain.networkName,
      value: chain.chainId.toString(),
      chain: {
        id: chain.chainId.toString(),
        name: chain.chainName,
        networkName: chain.networkName,
        svgUrl: chain.svgUrl
      }
    }));

    options.unshift({
      label: 'All',
      value: '0',
      chain: {
        id: '0',
        name: 'all',
        networkName: 'All',
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
    <div className="styled-chain-select" data-testid="chainDropdown">
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
            minWidth: '100%',
            maxWidth: '10rem'
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
          if (selectedOption?.chain?.id) {
            onChange?.(selectedOption.chain?.id.toString());
          }
        }}
        isMulti={false}
        formatOptionLabel={FormatChainOptionLabel}
        components={{
          Input: () => null,
          SingleValue: SelectedChainOption
        }}
      />
    </div>
  );
};
