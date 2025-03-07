import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useMemo } from 'react';
import { createContext } from 'react';
import { getQueryClient } from './queryClient';

export type FiatContextProps = {
  mvxApiURL: string;
};

const queryClient = getQueryClient();

export const FiatContext = createContext<FiatContextProps | undefined>(
  undefined
);

export function FiatProvider({
  children,
  mvxApiURL
}: PropsWithChildren<FiatContextProps>) {
  const value = useMemo<FiatContextProps>(() => {
    return {
      mvxApiURL
    };
  }, [mvxApiURL]);

  return (
    <FiatContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </FiatContext.Provider>
  );
}
