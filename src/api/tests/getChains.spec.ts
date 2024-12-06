import axios from 'axios';
import { ChainDTO } from 'dto/Chain.dto';
import { getChains } from '../getChains';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getChains', () => {
  const url = 'https://api.example.com';

  it('fetches chains successfully', async () => {
    const response: ChainDTO[] = [
      {
        chainId: 1,
        chainName: 'Chain One',
        chainType: 'type1',
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

    const result = await getChains({ url });

    expect(mockedAxios.get).toHaveBeenCalledWith('/chains', { baseURL: url });
    expect(result.data).toEqual(response);
  });

  it('handles error when fetching chains', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(getChains({ url })).rejects.toThrow('Network Error');
  });
});
