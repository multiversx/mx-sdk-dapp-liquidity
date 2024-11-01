import { useContext } from 'react';
import { Web3AppContext } from '../contexts/Web3AppProvider';

export function useWeb3App() {
  const context = useContext(Web3AppContext);

  if (context == null) {
    throw new Error('Web3AppContext must be used within a Web3AppProvider');
  }

  return context;
}
