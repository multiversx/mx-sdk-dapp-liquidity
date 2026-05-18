import { useAppKitNetworkCore, useAppKitProvider } from '@reown/appkit/react';
import { renderHook } from '@testing-library/react';
import { useSignMessage } from 'wagmi';
import { useGenericSignMessage } from '../useGenericSignMessage';

// Mock the local useAccount hook to avoid deep wagmi/appkit wiring
jest.mock('../useAccount', () => ({
  useAccount: jest.fn(() => ({
    address: undefined,
    isConnected: true
  }))
}));

const mockUseAppKitNetworkCore = jest.mocked(useAppKitNetworkCore);
const mockUseAppKitProvider = jest.mocked(useAppKitProvider);
const mockUseSignMessage = jest.mocked(useSignMessage);

beforeEach(() => {
  mockUseSignMessage.mockReturnValue({
    signMessageAsync: jest.fn(),
    data: undefined,
    error: null,
    isError: false,
    isIdle: true,
    isPending: false,
    isSuccess: false,
    reset: jest.fn(),
    status: 'idle',
    variables: undefined,
    context: undefined,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    submittedAt: 0,
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    signMessage: jest.fn()
  } as any);
});

describe('useGenericSignMessage — Sui signMessage', () => {
  const suiRequest = jest.fn();

  beforeEach(() => {
    suiRequest.mockReset();

    mockUseAppKitNetworkCore.mockReturnValue({
      caipNetwork: { chainNamespace: 'sui' }
    } as any);

    mockUseAppKitProvider.mockImplementation((namespace: string) => {
      if (namespace === 'sui') {
        return { walletProvider: { request: suiRequest } } as any;
      }
      return { walletProvider: undefined } as any;
    });
  });

  it('signs a valid short message successfully', async () => {
    suiRequest.mockResolvedValue({ signature: 'sui-message-sig' });

    const { result } = renderHook(() => useGenericSignMessage());
    const sig = await result.current.signMessage('hello world');

    expect(sig).toBe('sui-message-sig');
    expect(suiRequest).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'sui_signPersonalMessage' })
    );
  });

  it('throws when message payload exceeds 32 KiB', async () => {
    // Create a string whose UTF-8 encoding is larger than 32 KiB
    const largeMessage = 'a'.repeat(32 * 1024 + 1);

    const { result } = renderHook(() => useGenericSignMessage());

    await expect(result.current.signMessage(largeMessage)).rejects.toThrow(
      'maximum size'
    );

    expect(suiRequest).not.toHaveBeenCalled();
  });
});
