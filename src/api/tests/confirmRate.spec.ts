import axios from 'axios';
import { ConfirmRateDTO } from 'dto/ConfirmRateDTO';
import { ServerTransaction } from '../../types/transaction.ts';
import { confirmRate } from '../confirmRate';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('confirmRate', () => {
  const url = 'https://api.example.com';

  it('POST confirmRate successfully', async () => {
    const body: ConfirmRateDTO = {
      tokenIn: 'tokenIn',
      tokenOut: 'tokenOut',
      fee: '100',
      amountIn: '1000',
      amountOut: '900',
      fromChain: 'ETH',
      toChain: 'MVX',
      sender: '0x123',
      receiver: '0x456'
    };
    const nativeAuthToken =
      'ZXJkMXdoOWMwc2pyMnhuOGh6ZjAybHd3Y3I0amsyczg0dGF0OXVkMmthcTZ6cjd4enB2bDlsNXE4YXdtZXg.YUhSMGNITTZMeTlrWlhadVpYUXVkR1Z0Y0d4aGRHVXRaR0Z3Y0M1dGRXeDBhWFpsY25ONExtTnZiUS5lZjc2YjRjNzZlZjZlMTNhNjM5MDc2N2ZjNzhhODhjYTRiYmI1OTE4YTJiOWRkYzQ0OTQyOTI3NjkzNjUwNjUxLjg2NDAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTXpNME9EazBNREI5.04a986df7f0142837f9b1ca1ae4829f7b471e4c3470602ca6a16f2a4d7c6616c4e7628a93b4ce87d9534e95ab9215f893faeb9e0904e1d834007c16e43b12d01';
    const config = {
      baseURL: url,
      headers: {
        Authorization: `Bearer ${nativeAuthToken}`
      }
    };

    const response = [
      {
        from: '0xAlice',
        to: '0xBob',
        type: 'eip1559',
        gas: '100000',
        gasPrice: '1000000000',
        chainId: 1,
        hash: '0x1234',
        nonce: 1,
        value: '1000000000000000000'
      } as unknown as ServerTransaction
    ];
    mockedAxios.post.mockResolvedValue({ data: response });

    const result = await confirmRate({
      url,
      nativeAuthToken,
      body
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/rate/confirm',
      body,
      config
    );
    expect(result.data).toEqual(response);
  });

  it('POST confirmRate with no nativeAuthToken', async () => {
    const body: ConfirmRateDTO = {
      tokenIn: 'tokenIn',
      tokenOut: 'tokenOut',
      fee: '100',
      amountIn: '1000',
      amountOut: '900',
      fromChain: 'ETH',
      toChain: 'MVX',
      sender: '0x123',
      receiver: '0x456'
    };
    const nativeAuthToken = '';
    const config = {
      baseURL: url,
      headers: {}
    };

    const response = [
      {
        from: '0xAlice',
        to: '0xBob',
        type: 'eip1559',
        gas: '100000',
        gasPrice: '1000000000',
        chainId: 1,
        hash: '0x1234',
        nonce: 1,
        value: '1000000000000000000'
      } as unknown as ServerTransaction
    ];

    mockedAxios.post.mockResolvedValue({ data: response });

    const result = await confirmRate({
      url,
      nativeAuthToken,
      body
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/rate/confirm',
      body,
      config
    );
    expect(result.data).toEqual(response);
  });

  it('POST confirmRate should throw an error', async () => {
    const body: ConfirmRateDTO = {
      tokenIn: 'tokenIn',
      tokenOut: 'tokenOut',
      fee: '100',
      amountIn: '1000',
      amountOut: '900',
      fromChain: 'ETH',
      toChain: 'MVX',
      sender: '0x123',
      receiver: '0x456'
    };
    const nativeAuthToken = '';
    const config = {
      baseURL: url,
      headers: {}
    };

    mockedAxios.post.mockRejectedValue(new Error('error'));

    await expect(confirmRate({ url, nativeAuthToken, body })).rejects.toThrow(
      'error'
    );
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/rate/confirm',
      body,
      config
    );
  });
});
