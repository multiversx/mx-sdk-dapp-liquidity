import { decodeLoginToken } from '../decodeLoginToken';

describe('decodeLoginToken', () => {
  it('decodes a valid login token', () => {
    const token =
      'aHR0cHM6Ly9kZXZuZXQudGVtcGxhdGUtZGFwcC5tdWx0aXZlcnN4LmNvbQ.ef76b4c76ef6e13a6390767fc78a88ca4bbb5918a2b9ddc44942927693650651.86400.eyJ0aW1lc3RhbXAiOjE3MzM0ODk0MDB9';
    const expectedPayload = {
      origin: 'https://devnet.template-dapp.multiversx.com',
      blockHash:
        'ef76b4c76ef6e13a6390767fc78a88ca4bbb5918a2b9ddc44942927693650651',
      ttl: 86400,
      extraInfo: { timestamp: 1733489400 }
    };
    expect(decodeLoginToken(token)).toEqual(expectedPayload);
  });

  it('returns null for an invalid login token', () => {
    const token = 'invalid.token.here';
    expect(decodeLoginToken(token)).toBeNull();
  });

  it('returns null for an empty token', () => {
    const token = '';
    expect(decodeLoginToken(token)).toBeNull();
  });

  it('returns null for a token with less than 4 parts', () => {
    const token = 'part1.part2.part3';
    expect(decodeLoginToken(token)).toBeNull();
  });

  it('returns null for a token with more than 4 parts', () => {
    const token = 'part1.part2.part3.part4.part5';
    expect(decodeLoginToken(token)).toBeNull();
  });

  it('returns null for a token with invalid JSON in extraInfo', () => {
    const token = 'b3JpZ2lu.blockHash.3600.invalidBase64';
    expect(decodeLoginToken(token)).toBeNull();
  });
});
