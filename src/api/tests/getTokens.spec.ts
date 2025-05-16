import axios from 'axios';
import { TokenDTO } from 'dto/Token.dto';
import { getTokens } from '../getTokens';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getTokens', () => {
  const url = 'https://api.example.com';

  it('fetches tokens successfully without chainId', async () => {
    const response: TokenDTO[] = [
      {
        chainId: '1',
        address: '0x123',
        name: 'Token One',
        symbol: 'T1',
        decimals: 18,
        crosschain: true,
        pngUrl: 'https://example.com/logo.png',
        svgUrl: 'https://example.com/logo.svg',
        metadata: {
          minBridgeAmount: '1',
          maxBridgeAmount: '100'
        }
      }
    ];
    mockedAxios.get.mockResolvedValue({ data: response });

    const result = await getTokens({
      url,
      nativeAuthToken: '',
      bridgeOnly: false
    });

    expect(mockedAxios.get).toHaveBeenCalledWith('/tokens', { baseURL: url });
    expect(result.data).toEqual(response);
  });

  it('fetches tokens successfully with chainId', async () => {
    const chainId = 1;
    const response: TokenDTO[] = [
      {
        chainId: '1',
        address: '0x123',
        name: 'Token One',
        symbol: 'T1',
        decimals: 18,
        crosschain: true,
        pngUrl: 'https://example.com/logo.png',
        svgUrl: 'https://example.com/logo.svg',
        metadata: {
          minBridgeAmount: '1',
          maxBridgeAmount: '100'
        }
      }
    ];
    mockedAxios.get.mockResolvedValue({ data: response });

    const result = await getTokens({
      url,
      chainId,
      nativeAuthToken: '',
      bridgeOnly: false
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(`/tokens/${chainId}`, {
      baseURL: url
    });
    expect(result.data).toEqual(response);
  });

  it('handles error when fetching tokens', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(
      getTokens({ url, nativeAuthToken: '', bridgeOnly: false })
    ).rejects.toThrow('Network Error');
  });
});
