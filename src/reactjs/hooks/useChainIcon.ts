import Default from '../assets/default.svg';
import { ChainNameType, chainIdentifier } from '../types/chains';

export const useChainIcon = (identifier: ChainNameType) => {
  return chainIdentifier[identifier] || Default;
};
