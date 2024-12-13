export const safeWindow =
  // eslint-disable-next-line no-undef
  typeof window !== 'undefined' ? window : ({} as never);
export const safeDocument =
  typeof document !== 'undefined' ? safeWindow.document : ({} as never);
export const API_URL = 'http://localhost:3000';
