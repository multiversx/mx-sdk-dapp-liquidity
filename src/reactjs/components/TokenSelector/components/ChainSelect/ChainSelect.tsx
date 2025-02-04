import { useState } from 'react';
import Select from 'react-select';
import { FormatChainOptionLabel } from './components/FormatChainOptionLabel';
import { IndicatorSeparator } from './components/IndicatorSeparator';
import { ChainSelectOptionType } from './types/chainSelectOption';

export const ChainSelect = ({ isLoading }: { isLoading?: boolean }) => {
  const chainOptions: ChainSelectOptionType[] = [
    {
      label: 'All',
      value: 'all',
      chain: {
        id: '0',
        name: 'All',
        svgUrl: ''
      }
    },
    {
      label: 'Ethereum',
      value: 'ethereum',
      chain: {
        id: '1',
        name: 'Ethereum',
        svgUrl:
          'https://devnet-tools.multiversx.com/liquidity-sdk/ethereum/icon.svg'
      }
    },
    {
      label: 'Binance Smart Chain',
      value: 'bsc',
      chain: {
        id: '56',
        name: 'Binance Smart Chain',
        svgUrl: 'https://devnet-tools.multiversx.com/liquidity-sdk/bsc/icon.svg'
      }
    },
    {
      label: 'Polygon',
      value: 'polygon',
      chain: {
        id: '137',
        name: 'Polygon',
        svgUrl:
          'https://devnet-tools.multiversx.com/liquidity-sdk/polygon/icon.svg'
      }
    }
  ];

  const [selectedChain, setSelectedChain] = useState<ChainSelectOptionType>(
    chainOptions[0]
  );

  return (
    <div className={`select-holder`} data-testid="chainDropdown">
      <Select
        className="basic-single z-50 styled-chain-select"
        classNamePrefix="styled-chain-select"
        maxMenuHeight={260}
        value={selectedChain}
        isLoading={isLoading}
        styles={{
          indicatorSeparator: IndicatorSeparator
        }}
        isSearchable={true}
        name="chain"
        options={chainOptions}
        onChange={(selectedOption) =>
          setSelectedChain(selectedOption as ChainSelectOptionType)
        }
        formatOptionLabel={FormatChainOptionLabel}
      />
    </div>
  );
};
