export const testNumber = (value?: string) =>
  /^[+-]?\d+(\.\d+)?$/.test(value ?? '');
