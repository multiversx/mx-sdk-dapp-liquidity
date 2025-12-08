import { useEffect, useMemo, useRef, useState } from 'react';
import { ChainSelect } from './ChainSelect/ChainSelect';
import { TokenList } from './TokenList';
import { MVX_CHAIN_IDS } from '../../../../constants';
import { ChainDTO } from '../../../../dto/Chain.dto';
import { getDisplayName } from '../../../../helpers/getDisplayName';
import { TokenType } from '../../../../types/token';
import { ALL_NETWORK_ID } from '../../../constants';
import { MxSearch } from '../../base/MxSearch';

export const SelectContent = ({
  onSelect,
  tokens = [],
  chains = [],
  isMvxSelector = false,
  areChainsLoading,
  selectedToken
}: {
  onSelect: (token: TokenType) => void;
  tokens: TokenType[];
  chains: ChainDTO[];
  isMvxSelector?: boolean;
  areChainsLoading?: boolean;
  selectedToken?: TokenType;
}) => {
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selected, setSelected] = useState(selectedToken);
  const searchPatternRef = useRef<string>('');

  // Filter chains based on isMvxSelector
  const availableChains = useMemo(() => {
    if (isMvxSelector) {
      return chains.filter((chain) =>
        MVX_CHAIN_IDS.includes(chain.chainId.toString())
      );
    }
    return chains.filter(
      (chain) => !MVX_CHAIN_IDS.includes(chain.chainId.toString())
    );
  }, [chains, isMvxSelector]);

  // Get the default chain ID based on available chains and tokens
  const defaultChainId = useMemo(() => {
    if (isMvxSelector) {
      // For MVX selector, find the first MVX chain that has tokens
      const mvxChainWithTokens = availableChains.find((chain) =>
        tokens.some(
          (token) => token.chainId.toString() === chain.chainId.toString()
        )
      );
      return (
        mvxChainWithTokens?.chainId.toString() ??
        availableChains[0]?.chainId.toString() ??
        ALL_NETWORK_ID
      );
    }
    return ALL_NETWORK_ID;
  }, [availableChains, tokens, isMvxSelector]);

  const [selectedChainId, setSelectedChainId] = useState(defaultChainId);

  useEffect(() => {
    const isCurrentSelectionValid = availableChains.some(
      (chain) => chain.chainId.toString() === selectedChainId
    );
    if (!isCurrentSelectionValid) {
      setSelectedChainId(defaultChainId);
    }
  }, [defaultChainId, availableChains, selectedChainId]);

  const filteredTokensText = useMemo(() => {
    const selectedChain = availableChains.find(
      (chain) => chain.chainId.toString() === selectedChainId
    );

    if (!selectedChain) {
      return `Tokens on all networks (${tokens.length})`;
    }

    return `Tokens on ${getDisplayName(selectedChain)} (${filteredTokens.length})`;
  }, [availableChains, filteredTokens.length, selectedChainId, tokens.length]);

  const handleSelect = (token: TokenType) => {
    setSelected(token);
    onSelect(token);
  };

  const handleSearch = (pattern: string) => {
    searchPatternRef.current = pattern;

    if (selectedChainId === ALL_NETWORK_ID) {
      if (pattern.trim() === '') {
        setFilteredTokens(tokens);
      } else {
        const filtered = tokens.filter((token) =>
          token.symbol.toLowerCase().includes(pattern.toLowerCase())
        );
        setFilteredTokens(filtered);
      }
      return;
    }

    if (pattern.trim() === '') {
      const filtered = tokens.filter(
        (token) => token.chainId.toString() === selectedChainId.toString()
      );
      setFilteredTokens(filtered);
    } else {
      const filtered = tokens.filter(
        (token) =>
          token.symbol.toLowerCase().includes(pattern.toLowerCase()) &&
          token.chainId.toString() === selectedChainId.toString()
      );
      setFilteredTokens(filtered);
    }
  };

  useEffect(() => {
    setFilteredTokens(tokens);
    setSelected(selectedToken);
    searchPatternRef.current = '';
  }, [selectedToken, tokens]);

  useEffect(() => {
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
          {!isMvxSelector && (
            <ChainSelect
              chains={availableChains}
              ignoreAllChains={isMvxSelector}
              selectedChainId={selectedChainId}
              onChange={(chainId) => {
                setSelectedChainId(chainId);
              }}
              isLoading={areChainsLoading}
            />
          )}
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
