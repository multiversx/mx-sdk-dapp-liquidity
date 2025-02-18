import { useEffect, useMemo, useRef, useState } from 'react';
// import { useSwitchChain } from 'wagmi';
import { ChainSelect } from './ChainSelect/ChainSelect';
import { TokenList } from './TokenList';
import { ChainDTO } from '../../../../dto/Chain.dto';
import { TokenType } from '../../../../types/token';
import { useGetChainId } from '../../../hooks/useGetChainId';
import { MxSearch } from '../../MxSearch';

export const SelectContent = ({
  onSelect,
  tokens = [],
  chains = [],
  areChainsLoading,
  selectedToken
}: {
  onSelect: (token: TokenType) => void;
  tokens: TokenType[];
  chains: ChainDTO[];
  areChainsLoading?: boolean;
  selectedToken?: TokenType;
}) => {
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selected, setSelected] = useState(selectedToken);
  const searchPatternRef = useRef<string>('');
  // const { switchChain } = useSwitchChain();
  const activeChainId = useGetChainId();

  const [selectedChainId, setSelectedChainId] = useState(
    activeChainId?.toString() ?? '0'
  );

  const filteredTokensText = useMemo(() => {
    const selectedChain = chains.find(
      (chain) => chain.chainId.toString() === selectedChainId
    );

    if (!selectedChain) {
      return `Tokens on all networks (${tokens.length})`;
    }

    return `Tokens on ${selectedChain.networkName} (${filteredTokens.length})`;
  }, [chains, filteredTokens.length, selectedChainId, tokens.length]);

  const handleSelect = (token: TokenType) => {
    setSelected(token);
    onSelect(token);
  };

  useEffect(() => {
    setFilteredTokens(tokens);
    setSelected(selectedToken);
  }, [selectedToken, tokens]);

  const handleSearch = (pattern: string) => {
    searchPatternRef.current = pattern;

    if (selectedChainId === '0') {
      const filtered = tokens.filter((token) =>
        token.symbol.toLowerCase().includes(pattern.toLowerCase())
      );
      setFilteredTokens(filtered);
      return;
    }

    const filtered = tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(pattern.toLowerCase()) &&
        token.chainId.toString() === selectedChainId.toString()
    );
    setFilteredTokens(filtered);
  };

  useEffect(() => {
    // '0' means "All" option
    if (selectedChainId.toString() !== '0') {
      // switchChain({
      //   chainId: Number(selectedChainId)
      // });
    }
    handleSearch(searchPatternRef.current);
  }, [selectedChainId, tokens]);

  return (
    <div className="liq-relative liq-flex liq-max-w-full liq-flex-col liq-rounded-none liq-p-0 !liq-max-h-[22rem]">
      <div className="liq-flex liq-flex-col liq-gap-3 liq-rounded-t-2xl liq-p-2">
        <div className="liq-flex liq-gap-2">
          <MxSearch
            inputClassName="!liq-bg-neutral-750 liq-border liq-border-neutral-750"
            placeholder="Search token"
            onChange={handleSearch}
          />
          <ChainSelect
            chains={chains}
            selectedChainId={selectedChainId}
            onChange={(chainId) => {
              setSelectedChainId(chainId);
            }}
            isLoading={areChainsLoading}
          />
        </div>
      </div>

      <div className="scrollbar-thin liq-flex liq-flex-col liq-gap-2 liq-overflow-y-scroll liq-border-t liq-border-neutral-750 liq-pb-3">
        <div className="liq-flex liq-text-left liq-text-neutral-300 liq-mt-4 liq-ml-2">
          {filteredTokensText}
        </div>
        <TokenList
          tokens={filteredTokens}
          onSelect={handleSelect}
          selectedToken={selected}
        />
      </div>
    </div>
  );
};
