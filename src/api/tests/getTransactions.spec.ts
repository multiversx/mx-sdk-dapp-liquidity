import axios from 'axios';
import { TransactionDTO } from 'dto/Transaction.dto';
import { getTransactions } from '../getTransactions';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getTransactions', () => {
  const url = 'https://api.example.com';

  it('fetches transactions without userWalletAddress', async () => {
    const userWalletAddress = '';

    const response: TransactionDTO[] = [
      {
        transactionId: '1',
        userWalletAddress: 'wallet1',
        providerId: 'provider1',
        fromChain: 'chain1',
        toChain: 'chain2',
        fromToken: 'token1',
        toToken: 'token2',
        fromAmount: 100,
        toAmount: 200,
        fee: 10,
        status: 'completed',
        transactionHash: 'hash1',
        timestamp: '1733489400',
        transactionDetails: 'details1'
      }
    ];
    mockedAxios.get.mockResolvedValue({ data: response });

    const result = await getTransactions({ url, userWalletAddress });

    expect(mockedAxios.get).toHaveBeenCalledWith('/transactions', {
      baseURL: url
    });
    expect(result.data).toEqual(response);
  });

  it('fetches transactions with userWalletAddress', async () => {
    const userWalletAddress = '0x123';
    const response: TransactionDTO[] = [
      {
        transactionId: '1',
        userWalletAddress: 'wallet1',
        providerId: 'provider1',
        fromChain: 'chain1',
        toChain: 'chain2',
        fromToken: 'token1',
        toToken: 'token2',
        fromAmount: 100,
        toAmount: 200,
        fee: 10,
        status: 'completed',
        transactionHash: 'hash1',
        timestamp: '2023-01-01T00:00:00Z',
        transactionDetails: 'details1'
      }
    ];
    mockedAxios.get.mockResolvedValue({ data: response });

    const result = await getTransactions({ url, userWalletAddress });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/transactions/${userWalletAddress}`,
      { baseURL: url }
    );
    expect(result.data).toEqual(response);
  });

  it('fetches transactions with both transactionId and userWalletAddress', async () => {
    const userWalletAddress = '0x123';
    const response: TransactionDTO[] = [
      {
        transactionId: '1',
        userWalletAddress: 'wallet1',
        providerId: 'provider1',
        fromChain: 'chain1',
        toChain: 'chain2',
        fromToken: 'token1',
        toToken: 'token2',
        fromAmount: 100,
        toAmount: 200,
        fee: 10,
        status: 'completed',
        transactionHash: 'hash1',
        timestamp: '2023-01-01T00:00:00Z',
        transactionDetails: 'details1'
      }
    ];
    mockedAxios.get.mockResolvedValue({ data: response });

    const result = await getTransactions({
      url,
      userWalletAddress
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/transactions/${userWalletAddress}`,
      { baseURL: url }
    );
    expect(result.data).toEqual(response);
  });
});
