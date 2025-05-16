import axios from 'axios';
import { ChainDTO } from 'dto/Chain.dto';
import { ChainType } from 'types/chainType';
import { getChains } from '../getChains';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getChains', () => {
  const url = 'https://api.example.com';

  it('fetches chains successfully', async () => {
    const response: ChainDTO[] = [
      {
        chainId: '1',
        chainName: 'msx',
        pngUrl:
          'https://devnet-tools.multiversx.com/liquidity-sdk/ethereum/icon.png',
        svgUrl:
          'https://devnet-tools.multiversx.com/liquidity-sdk/ethereum/icon.svg',
        chainType: ChainType.evm,
        rpc: 'rpc1',
        blockExplorerUrls: ['explorer1'],
        nativeCurrency: {
          name: 'Currency One',
          symbol: 'CUR1',
          decimals: 18,
          icon: 'icon1'
        },
        networkName: 'Network One'
      }
    ];
    mockedAxios.get.mockResolvedValue({ data: response });

    const result = await getChains({
      url,
      nativeAuthToken: 'ZKssadass',
      bridgeOnly: false
    });

    expect(mockedAxios.get).toHaveBeenCalledWith('/chains', { baseURL: url });
    expect(result.data).toEqual(response);
  });

  it('handles error when fetching chains', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(
      getChains({ url, nativeAuthToken: 'ZKssadass', bridgeOnly: false })
    ).rejects.toThrow('Network Error');
  });
});
