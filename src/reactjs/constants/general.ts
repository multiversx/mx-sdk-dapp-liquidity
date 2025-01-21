export const safeWindow =
  // eslint-disable-next-line no-undef
  typeof window !== 'undefined' ? window : ({} as never);
export const safeDocument =
  typeof document !== 'undefined' ? safeWindow.document : ({} as never);

export const mvxChainIds = [31, 44, 54];
