import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const mxClsx = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
