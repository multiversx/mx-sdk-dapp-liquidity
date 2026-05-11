import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { renderHook } from '@testing-library/react';
import { useSendTransaction } from 'wagmi';
import { useSignTransaction } from '../useSignTransaction';

// These modules are not covered by the global setupTests.ts mocks
jest.mock('@reown/appkit-adapter-solana/react', () => ({
  useAppKitConnection: jest.fn(() => ({ connection: null }))
}));

jest.mock('@solana/web3.js', () => ({
  PublicKey: jest.fn(),
  Transaction: jest.fn(() => ({ add: jest.fn().mockReturnThis() })),
  TransactionInstruction: jest.fn()
}));

const mockUseAppKitProvider = jest.mocked(useAppKitProvider);
const mockUseAppKitAccount = jest.mocked(useAppKitAccount);
const mockUseSendTransaction = jest.mocked(useSendTransaction);

beforeEach(() => {
  // The global wagmi mock returns undefined by default — provide a minimal stub
  mockUseSendTransaction.mockReturnValue({
    data: undefined,
    sendTransactionAsync: jest.fn(),
    error: null,
    isError: false,
    isIdle: true,
    isPending: false,
    isSuccess: false,
    reset: jest.fn(),
    sendTransaction: jest.fn(),
    status: 'idle',
    variables: undefined,
    context: undefined,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    submittedAt: 0,
    mutate: jest.fn(),
    mutateAsync: jest.fn()
  } as any);
});

const CONNECTED_SUI_ADDRESS =
  '0xabc123def456aaa000111222333444555666777888999aaabbbcccdddeeefff00';

/** Helper: set up provider mocks for Sui tests */
function setupSuiMocks(suiRequest: jest.Mock) {
  mockUseAppKitProvider.mockImplementation((namespace: string) => {
    if (namespace === 'sui') {
      return { walletProvider: { request: suiRequest } } as any;
    }
    return { walletProvider: undefined } as any;
  });

  mockUseAppKitAccount.mockImplementation((opts?: any) => {
    if (opts?.namespace === 'sui') {
      return {
        address: CONNECTED_SUI_ADDRESS,
        isConnected: true,
        status: 'connected'
      } as any;
    }
    return {
      address: undefined,
      isConnected: false,
      status: 'disconnected'
    } as any;
  });
}

describe('useSignTransaction — signSuiTransaction', () => {
  const validBase64 = btoa('valid transaction bytes');

  beforeEach(() => {
    mockUseSendTransaction.mockReturnValue({
      data: undefined,
      sendTransactionAsync: jest.fn(),
      error: null,
      isError: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      reset: jest.fn(),
      sendTransaction: jest.fn(),
      status: 'idle',
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
      mutate: jest.fn(),
      mutateAsync: jest.fn()
    } as any);
  });

  it('succeeds with valid base64 payload', async () => {
    const mockRequest = jest
      .fn()
      .mockResolvedValue({ signature: 'sui-sig-ok' });
    setupSuiMocks(mockRequest);

    const { result } = renderHook(() => useSignTransaction());

    const sig = await result.current.sui.signTransaction({
      transaction: validBase64,
      address: CONNECTED_SUI_ADDRESS
    });

    expect(sig).toBe('sui-sig-ok');
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'sui_signTransaction' })
    );
  });

  it('throws when payload is not valid base64', async () => {
    const mockRequest = jest.fn();
    setupSuiMocks(mockRequest);

    const { result } = renderHook(() => useSignTransaction());

    await expect(
      result.current.sui.signTransaction({
        transaction: 'not-valid-base64!!!',
        address: CONNECTED_SUI_ADDRESS
      })
    ).rejects.toThrow('not valid base64');

    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('throws when payload exceeds 32 KiB', async () => {
    const mockRequest = jest.fn();
    setupSuiMocks(mockRequest);

    // Build a string that decodes to more than 32 * 1024 bytes
    const largeBytes = new Uint8Array(32 * 1024 + 1);
    const largeBase64 = btoa(String.fromCharCode(...largeBytes));

    const { result } = renderHook(() => useSignTransaction());

    await expect(
      result.current.sui.signTransaction({
        transaction: largeBase64,
        address: CONNECTED_SUI_ADDRESS
      })
    ).rejects.toThrow('maximum size');

    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('throws when payload is an empty string', async () => {
    const mockRequest = jest.fn();
    setupSuiMocks(mockRequest);

    const { result } = renderHook(() => useSignTransaction());

    // Empty string is falsy — caught by the pre-existing guard which throws
    // 'No Sui transaction bytes provided' before the new validation runs.
    // The new guard covers the case where a non-empty but invalid string is passed.
    await expect(
      result.current.sui.signTransaction({
        transaction: '',
        address: CONNECTED_SUI_ADDRESS
      })
    ).rejects.toThrow('No Sui transaction bytes provided');

    expect(mockRequest).not.toHaveBeenCalled();
  });
});

describe('useSignTransaction — signPSBT', () => {
  it('forwards signInputs verbatim to btcWalletProvider.signPSBT', async () => {
    const mockSignPSBT = jest.fn().mockResolvedValue({ psbt: 'signed-psbt' });

    // Return the BTC wallet provider mock only for the 'bip122' namespace
    mockUseAppKitProvider.mockImplementation((namespace: string) => {
      if (namespace === 'bip122') {
        return { walletProvider: { signPSBT: mockSignPSBT } } as any;
      }
      return { walletProvider: undefined } as any;
    });

    const { result } = renderHook(() => useSignTransaction());

    const signInputs = [
      {
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        index: 0,
        sighashTypes: [1]
      }
    ];

    const params = {
      psbt: 'base64psbt==',
      signInputs: [...signInputs],
      broadcast: false
    };

    // Keep a reference to the original signInputs to check for mutation
    const originalSignInputs = params.signInputs;

    const psbt = await result.current.bitcoin.signTransaction(params);

    // The mock was called with the exact signInputs the caller provided
    expect(mockSignPSBT).toHaveBeenCalledWith(
      expect.objectContaining({
        signInputs: [
          {
            address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            index: 0,
            sighashTypes: [1]
          }
        ]
      })
    );

    // The caller's signInputs must NOT have been overwritten to []
    expect(mockSignPSBT).not.toHaveBeenCalledWith(
      expect.objectContaining({ signInputs: [] })
    );

    // The params object was not mutated — signInputs still references the original array
    expect(params.signInputs).toBe(originalSignInputs);
    expect(params.signInputs).toEqual(signInputs);

    // Return value is the psbt string
    expect(psbt).toBe('signed-psbt');
  });

  it('throws when btcWalletProvider is not available', async () => {
    mockUseAppKitProvider.mockImplementation(
      () =>
        ({
          walletProvider: undefined
        }) as any
    );

    const { result } = renderHook(() => useSignTransaction());

    await expect(
      result.current.bitcoin.signTransaction({
        psbt: 'base64psbt==',
        signInputs: [],
        broadcast: false
      })
    ).rejects.toThrow('user is disconnected');
  });
});
