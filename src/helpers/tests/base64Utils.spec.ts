import { encodeToBase64, decodeBase64 } from '../base64Utils';

describe('base64Utils', () => {
  it('encodes a string to base64', () => {
    const input = 'Hello, World!';
    const expectedOutput = 'SGVsbG8sIFdvcmxkIQ==';
    expect(encodeToBase64(input)).toBe(expectedOutput);
  });

  it('decodes a base64 string', () => {
    const input = 'SGVsbG8sIFdvcmxkIQ==';
    const expectedOutput = 'Hello, World!';
    expect(decodeBase64(input)).toBe(expectedOutput);
  });

  it('encodes an empty string to base64', () => {
    const input = '';
    const expectedOutput = '';
    expect(encodeToBase64(input)).toBe(expectedOutput);
  });

  it('decodes an empty base64 string', () => {
    const input = '';
    const expectedOutput = '';
    expect(decodeBase64(input)).toBe(expectedOutput);
  });

  it('retrieve the given input if is an invalid base64 string', () => {
    const input = 'Invalid base64 string';
    const decoded = decodeBase64(input);
    expect(decoded).toEqual(input);
  });
});
