import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useMemo } from 'react';
import { createContext } from 'react';
import { getQueryClient } from './queryClient';
import { InitFiatOptions } from '../init';

export type FiatContextProps = {
  options: InitFiatOptions;
};

const queryClient = getQueryClient();

export const FiatContext = createContext<FiatContextProps | undefined>(
  undefined
);

export function FiatProvider({
  children,
  options
}: PropsWithChildren<FiatContextProps>) {
  const value = useMemo<FiatContextProps>(() => {
    return {
      options
    };
  }, [options]);

  return (
    <FiatContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </FiatContext.Provider>
  );
}
