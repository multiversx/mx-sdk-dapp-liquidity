const BLOCKED_PREFIXES = ['data:', 'javascript:', 'file:', 'blob:'];
const MAX_URL_LENGTH = 2048;

export function safeImageUrl(url: string | undefined, fallback = ''): string {
  if (!url || typeof url !== 'string' || url.length === 0) {
    return fallback;
  }

  if (url.length > MAX_URL_LENGTH) {
    return fallback;
  }

  const lower = url.toLowerCase();

  for (const prefix of BLOCKED_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return fallback;
    }
  }

  if (!lower.startsWith('https://')) {
    return fallback;
  }

  return url;
}
