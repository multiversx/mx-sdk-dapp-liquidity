import axios from 'axios';
import { TransactionDTO } from 'dto/Transaction.dto';
import { ProviderType } from '../../types/providerType';
import { getTransactions } from '../getTransactions';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getTransactions', () => {
  const url = 'https://api.example.com';
  const mockResponse: TransactionDTO[] = [
    {
      fromChainId: '97',
      toChainId: '44',
      tokenIn: '0x063b637324e6115f8da67f761A99B7F00B7Fd908',
      tokenOut: 'USDT-58d5d0',
      amountIn: '11000000',
      amountOut: '11000000',
      depositTimestamp: 1738054613,
      sender: '0x1009c2f59e03c383ca8f2766cfe305a1e79f4c8d',
      status: 'success',
      receiver:
        'erd1sp0aaszznqnuvyvkmxkv2ultcvlf637c093sfc26dszks60jdqsqy2knqu',
      txHash:
        '0xe7e706c1793d06a252a3f040f07732989e4a6466d804cae17105c09818bc2994',
      fee: '0',
      provider: ProviderType.MultiversxBridge
    }
  ];

  beforeEach(() => {
    mockedAxios.get.mockClear();
    mockedAxios.get.mockResolvedValue({ data: mockResponse });
  });

  it('fetches transactions with only address parameter', async () => {
    const address = '0x123';

    const result = await getTransactions({ url, address });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/transactions?receiver=0x123',
      { baseURL: url }
    );
    expect(result.data).toEqual(mockResponse);
  });

  it('fetches transactions with empty address', async () => {
    const address = '';

    const result = await getTransactions({ url, address });

    expect(mockedAxios.get).toHaveBeenCalledWith('/transactions?', {
      baseURL: url
    });
    expect(result.data).toEqual(mockResponse);
  });

  it('includes all non-empty parameters in the query', async () => {
    const result = await getTransactions({
      url,
      address: '0x123',
      sender: '0xABC',
      provider: ProviderType.MultiversxBridge,
      status: 'success',
      tokenIn: '0xTOKEN',
      tokenOut: 'WEGLD-123456'
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/transactions?receiver=0x123&sender=0xABC&provider=multiversxBridge&status=success&tokenIn=0xTOKEN&tokenOut=WEGLD-123456',
      { baseURL: url }
    );
    expect(result.data).toEqual(mockResponse);
  });

  it('excludes empty parameters from the query', async () => {
    const result = await getTransactions({
      url,
      address: '0x123',
      sender: '',
      provider: ProviderType.MultiversxBridge,
      status: '',
      tokenIn: '0xTOKEN',
      tokenOut: ''
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/transactions?receiver=0x123&provider=multiversxBridge&tokenIn=0xTOKEN',
      { baseURL: url }
    );
    expect(result.data).toEqual(mockResponse);
  });

  it('handles axios error', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(getTransactions({ url, address: '0x123' })).rejects.toThrow(
      'Network error'
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/transactions?receiver=0x123',
      { baseURL: url }
    );
  });

  it('passes through axios response', async () => {
    const axiosResponse = {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };

    mockedAxios.get.mockResolvedValueOnce(axiosResponse);

    const result = await getTransactions({ url, address: '0x123' });

    expect(result).toEqual(axiosResponse);
  });
});
