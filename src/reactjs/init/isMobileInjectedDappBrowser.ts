import { safeWindow } from '../constants';

export function isMobileInjectedDappBrowser(): boolean {
  if (!safeWindow.navigator.userAgent) {
    return false;
  }

  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(safeWindow.navigator.userAgent) &&
    !/Windows Phone/i.test(safeWindow.navigator.userAgent);

  const hasInjectedProvider = Boolean(safeWindow.ethereum);

  return isMobile && hasInjectedProvider;
}
