import { useContext } from 'react';
import { FiatContext } from './FiatProvider';

export function useFiat() {
  const context = useContext(FiatContext);

  if (context == null) {
    throw new Error('FiatContext must be used within a FiatProvider');
  }

  return context;
}
