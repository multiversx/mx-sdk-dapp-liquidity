import axios from 'axios';
import { RateRequestResponse } from 'types/rate';
import { getRate } from '../getRate';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getRate', () => {
  const url = 'https://api.example.com';

  it('POST rate successfully', async () => {
    const body = {
      tokenIn: 'wUSDC',
      tokenOut: 'wETH',
      fromChain: 'ETH',
      toChain: 'MVX',
      amountIn: '1000000000000000000'
    };
    const nativeAuthToken =
      'ZXJkMXdoOWMwc2pyMnhuOGh6ZjAybHd3Y3I0amsyczg0dGF0OXVkMmthcTZ6cjd4enB2bDlsNXE4YXdtZXg.YUhSMGNITTZMeTlrWlhadVpYUXVkR1Z0Y0d4aGRHVXRaR0Z3Y0M1dGRXeDBhWFpsY25ONExtTnZiUS5lZjc2YjRjNzZlZjZlMTNhNjM5MDc2N2ZjNzhhODhjYTRiYmI1OTE4YTJiOWRkYzQ0OTQyOTI3NjkzNjUwNjUxLjg2NDAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTXpNME9EazBNREI5.04a986df7f0142837f9b1ca1ae4829f7b471e4c3470602ca6a16f2a4d7c6616c4e7628a93b4ce87d9534e95ab9215f893faeb9e0904e1d834007c16e43b12d01';
    const config = {
      baseURL: url,
      headers: {
        Authorization: `Bearer ${nativeAuthToken}`,
        origin: 'https://devnet.template-dapp.multiversx.com'
      }
    };

    const response: RateRequestResponse = {
      fee: '5',
      amountOut: '100'
    };
    mockedAxios.post.mockResolvedValue({ data: response });

    const result = await getRate({
      url,
      nativeAuthToken,
      body
    });

    expect(mockedAxios.post).toHaveBeenCalledWith('/rate', body, config);
    expect(result.data).toBe(response);
  });

  it('POST rate with no nativeAuthToken', async () => {
    const body = {
      tokenIn: 'wUSDC',
      tokenOut: 'wETH',
      fromChain: 'ETH',
      toChain: 'MVX',
      amountIn: '1000000000000000000'
    };
    const nativeAuthToken = '';
    const config = {
      baseURL: url,
      headers: {}
    };

    const response: RateRequestResponse = {
      fee: '5',
      amountOut: '100'
    };

    mockedAxios.post.mockResolvedValue({ data: response });

    const result = await getRate({
      url,
      nativeAuthToken,
      body
    });

    expect(mockedAxios.post).toHaveBeenCalledWith('/rate', body, config);
    expect(result.data).toBe(response);
  });

  it('POST rate should throw an error', async () => {
    const body = {
      tokenIn: 'wUSDC',
      tokenOut: 'wETH',
      fromChain: 'ETH',
      toChain: 'MVX',
      amountIn: '1000000000000000000'
    };
    const nativeAuthToken = '';
    const config = {
      baseURL: url,
      headers: {}
    };

    mockedAxios.post.mockRejectedValue(new Error('error'));

    await expect(getRate({ url, nativeAuthToken, body })).rejects.toThrow(
      'error'
    );
    expect(mockedAxios.post).toHaveBeenCalledWith('/rate', body, config);
  });
});
