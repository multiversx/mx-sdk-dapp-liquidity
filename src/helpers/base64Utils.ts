export function isStringBase64(str: string) {
  try {
    // Try to decode the string and encode it back using base64 functions
    const atobDecoded = atob(str);
    const btoaEncoded = btoa(atobDecoded);
    const bufferFromDecoded = Buffer.from(str, 'base64').toString();
    const bufferFromEncoded = Buffer.from(bufferFromDecoded).toString('base64');

    // If the result is equal to the initial string
    const isBtoaEqual = str === btoaEncoded || btoaEncoded.startsWith(str);
    const isBufferFromBase64Equal =
      str === bufferFromEncoded || bufferFromEncoded.startsWith(str);
    const isEqualToInitialString = isBtoaEqual && isBufferFromBase64Equal;

    if (isEqualToInitialString) {
      // it is a regular base64 string
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}

export function encodeToBase64(string: string) {
  return btoa(string);
}

export function decodeBase64(string: string) {
  if (!isStringBase64(string)) {
    return string;
  }

  return atob(string);
}
