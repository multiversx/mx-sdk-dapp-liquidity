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
        sourceChain: 'bsc',
        destinationChain: 'msx',
        tokenSource: '0x063b637324e6115f8da67f761A99B7F00B7Fd908',
        tokenDestination: 'USDT-58d5d0',
        amountSource: '11000000',
        amountDestination: '11000000',
        depositTimestamp: 1738054613,
        executionTimestamp: 1738054802,
        sender: '0x1009c2f59e03c383ca8f2766cfe305a1e79f4c8d',
        status: 'success',
        nonce: 885,
        receiver:
          'erd1sp0aaszznqnuvyvkmxkv2ultcvlf637c093sfc26dszks60jdqsqy2knqu',
        batchId: 503,
        depositTxHash:
          '0xe7e706c1793d06a252a3f040f07732989e4a6466d804cae17105c09818bc2994',
        version: '3',
        executeTxHash:
          'ac8f4d15e9f444637e0bb2d4f0620049a040d964c3d0cb92713a1969e41b402e'
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
        sourceChain: 'bsc',
        destinationChain: 'msx',
        tokenSource: '0x063b637324e6115f8da67f761A99B7F00B7Fd908',
        tokenDestination: 'USDT-58d5d0',
        amountSource: '11000000',
        amountDestination: '11000000',
        depositTimestamp: 1738054613,
        executionTimestamp: 1738054802,
        sender: '0x1009c2f59e03c383ca8f2766cfe305a1e79f4c8d',
        status: 'success',
        nonce: 885,
        receiver:
          'erd1sp0aaszznqnuvyvkmxkv2ultcvlf637c093sfc26dszks60jdqsqy2knqu',
        batchId: 503,
        depositTxHash:
          '0xe7e706c1793d06a252a3f040f07732989e4a6466d804cae17105c09818bc2994',
        version: '3',
        executeTxHash:
          'ac8f4d15e9f444637e0bb2d4f0620049a040d964c3d0cb92713a1969e41b402e'
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
        sourceChain: 'bsc',
        destinationChain: 'msx',
        tokenSource: '0x063b637324e6115f8da67f761A99B7F00B7Fd908',
        tokenDestination: 'USDT-58d5d0',
        amountSource: '11000000',
        amountDestination: '11000000',
        depositTimestamp: 1738054613,
        executionTimestamp: 1738054802,
        sender: '0x1009c2f59e03c383ca8f2766cfe305a1e79f4c8d',
        status: 'success',
        nonce: 885,
        receiver:
          'erd1sp0aaszznqnuvyvkmxkv2ultcvlf637c093sfc26dszks60jdqsqy2knqu',
        batchId: 503,
        depositTxHash:
          '0xe7e706c1793d06a252a3f040f07732989e4a6466d804cae17105c09818bc2994',
        version: '3',
        executeTxHash:
          'ac8f4d15e9f444637e0bb2d4f0620049a040d964c3d0cb92713a1969e41b402e'
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
