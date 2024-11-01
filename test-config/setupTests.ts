import jestFetchMock from 'jest-fetch-mock';

jestFetchMock.enableMocks();

export const jestTimout = 60000;
export const jestNumRetries = 0;

jest.setTimeout(jestTimout);
jest.retryTimes(jestNumRetries);

jest.mock('@reown/appkit-adapter-wagmi');
jest.mock('@reown/appkit/react');
jest.mock('wagmi');
jest.mock('wagmi/connectors', () => ({
  ...jest.requireActual('wagmi/connectors'),
  injected: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    getAccount: jest.fn(),
    getChainId: jest.fn(),
    getProvider: jest.fn(),
    onAccountsChanged: jest.fn(),
    onChainChanged: jest.fn(),
    onDisconnect: jest.fn()
  })),
  walletConnect: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    getAccount: jest.fn(),
    getChainId: jest.fn(),
    getProvider: jest.fn(),
    onAccountsChanged: jest.fn(),
    onChainChanged: jest.fn(),
    onDisconnect: jest.fn()
  }))
}));

// Clean up after the tests are finished.
afterEach(() => {
  // Clear the mocks after each test.
});
