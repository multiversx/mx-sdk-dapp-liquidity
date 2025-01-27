import axios from 'axios';
import { sendTransactions } from 'api/sendTransactions';
import { serializeTransaction } from '../../helpers/serializeTransaction';
import { ServerTransaction } from '../../types/transaction';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('sendTransactions', () => {
  const url = 'https://api.example.com';
  const token = 'someValidToken';
  const transactions = [
    {
      from: '0xAlice',
      to: '0xBob',
      type: 'eip1559',
      gas: BigInt(100000),
      gasPrice: BigInt(1000000000),
      chainId: 1,
      hash: '0x1234',
      nonce: 1,
      value: BigInt(1000000000000000000)
    } as unknown as ServerTransaction
  ];

  it('POST sendTransactions successfully', async () => {
    const response = { data: { transactions } };
    mockedAxios.post.mockResolvedValue(response);

    const result = await sendTransactions({ transactions, url, token });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/transactions',
      transactions.map((transaction) =>
        JSON.parse(serializeTransaction(transaction))
      ),
      {
        baseURL: url,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    expect(result.data).toEqual(response.data);
  });

  it('POST sendTransactions with additional axiosConfig', async () => {
    const axiosConfig = { timeout: 1000 };
    const response = { data: { transactions } };
    mockedAxios.post.mockResolvedValue(response);

    const result = await sendTransactions({
      transactions,
      url,
      token,
      axiosConfig
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/transactions',
      transactions.map((transaction) =>
        JSON.parse(serializeTransaction(transaction))
      ),
      {
        baseURL: url,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        timeout: 1000
      }
    );
    expect(result.data).toEqual(response.data);
  });

  it('handles error when sending transactions', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network Error'));

    await expect(
      sendTransactions({
        transactions: transactions.map((transaction) =>
          JSON.parse(serializeTransaction(transaction))
        ),
        url,
        token
      })
    ).rejects.toThrow('Network Error');
  });
});
