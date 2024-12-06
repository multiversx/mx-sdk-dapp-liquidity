import { decodeBase64 } from './base64Utils';
import { decodeLoginToken } from './decodeLoginToken';

export const decodeToken = async (token: string) => {
  if (!token) {
    return null;
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    console.error('Invalid nativeAuthToken. Token must have 3 parts.');
    return null;
  }

  try {
    const [address, body, signature] = parts;
    const parsedAddress = decodeBase64(address);
    const parsedBody = decodeBase64(body);
    const parsedInitToken = decodeLoginToken(parsedBody);

    if (!parsedInitToken) {
      return {
        address: parsedAddress,
        body: parsedBody,
        signature,
        blockHash: '',
        origin: '',
        ttl: 0
      };
    }

    const result = {
      ...parsedInitToken,
      address: parsedAddress,
      body: parsedBody,
      signature
    };

    if (!parsedInitToken.extraInfo?.timestamp) {
      delete result.extraInfo;
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
