import { ChainDTO } from 'dto/Chain.dto';
import { ChainName } from 'reactjs/constants';

export const getDisplayName = (chain?: ChainDTO) => {
  if (!chain?.chainName) {
    return chain?.networkName || '';
  }

  return (
    ChainName[chain.chainName as keyof typeof ChainName] || chain.networkName
  );
};
