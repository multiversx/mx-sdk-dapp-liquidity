import { safeWindow } from '../constants';

export const getCompletePathname = () =>
  `${safeWindow.location.pathname}${safeWindow.location.search}`;
