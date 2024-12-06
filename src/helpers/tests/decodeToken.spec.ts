import { decodeToken } from '../decodeToken';

describe('decodeToken', () => {
  it('decodes a valid native auth token', async () => {
    const token =
      'ZXJkMXdoOWMwc2pyMnhuOGh6ZjAybHd3Y3I0amsyczg0dGF0OXVkMmthcTZ6cjd4enB2bDlsNXE4YXdtZXg.YUhSMGNITTZMeTlrWlhadVpYUXVkR1Z0Y0d4aGRHVXRaR0Z3Y0M1dGRXeDBhWFpsY25ONExtTnZiUS5lZjc2YjRjNzZlZjZlMTNhNjM5MDc2N2ZjNzhhODhjYTRiYmI1OTE4YTJiOWRkYzQ0OTQyOTI3NjkzNjUwNjUxLjg2NDAwLmV5SjBhVzFsYzNSaGJYQWlPakUzTXpNME9EazBNREI5.04a986df7f0142837f9b1ca1ae4829f7b471e4c3470602ca6a16f2a4d7c6616c4e7628a93b4ce87d9534e95ab9215f893faeb9e0904e1d834007c16e43b12d01';
    const expectedPayload = {
      address: 'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
      blockHash:
        'ef76b4c76ef6e13a6390767fc78a88ca4bbb5918a2b9ddc44942927693650651',
      body: 'aHR0cHM6Ly9kZXZuZXQudGVtcGxhdGUtZGFwcC5tdWx0aXZlcnN4LmNvbQ.ef76b4c76ef6e13a6390767fc78a88ca4bbb5918a2b9ddc44942927693650651.86400.eyJ0aW1lc3RhbXAiOjE3MzM0ODk0MDB9',
      extraInfo: {
        timestamp: 1733489400
      },
      origin: 'https://devnet.template-dapp.multiversx.com',
      signature:
        '04a986df7f0142837f9b1ca1ae4829f7b471e4c3470602ca6a16f2a4d7c6616c4e7628a93b4ce87d9534e95ab9215f893faeb9e0904e1d834007c16e43b12d01',
      ttl: 86400
    };
    expect(decodeToken(token)).toEqual(expectedPayload);
  });

  it('returns null for an invalid native auth token', async () => {
    const token = 'invalid.token.here';
    expect(decodeToken(token)).toBeNull();
  });

  it('returns null for an empty token', async () => {
    const token = '';
    expect(decodeToken(token)).toBeNull();
  });
});
