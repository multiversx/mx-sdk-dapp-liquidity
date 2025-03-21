import axios from 'axios';
import { TransactionDTO } from 'dto/Transaction.dto';
import { ProviderType } from '../../types/providerType.ts';
import { getTransactions } from '../getTransactions';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getTransactions', () => {
  const url = 'https://api.example.com';

  it('fetches transactions without userWalletAddress', async () => {
    const userWalletAddress = '';

    const response: TransactionDTO[] = [
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
