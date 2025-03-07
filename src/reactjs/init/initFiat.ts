import { InMemoryStore } from '../../store/inMemoryStore';

export type InitFiatOptions = {
  /**
   * Liquidity API URL
   */
  apiURL: string;
  /**
   * MultiversX API URL
   */
  mvxApiURL: string;
  /**
   * MultiversX Explorer URL
   */
  mvxExplorerAddress: string;
  /**
   * MultiversX Chain ID
   * Possible options 31 | 44 | 54 which are mapped to 1 | D | T
   */
  mvxChainId: '31' | '44' | '54';
};

export function initFiat(options: InitFiatOptions) {
  const store = InMemoryStore.getInstance();
  store.setItem('apiURL', options.apiURL);
  store.setItem('mvxApiURL', options.mvxApiURL);
  store.setItem('mvxExplorerAddress', options.mvxExplorerAddress);
  store.setItem('mvxChainId', options.mvxChainId);

  return {
    options
  };
}
