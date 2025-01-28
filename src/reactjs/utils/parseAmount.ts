import { TokenPayment } from '@multiversx/sdk-core';
import { DECIMALS } from '@multiversx/sdk-dapp-utils/out/constants/dappConstants';

export function parseAmount(amount: string, numDecimals: number = DECIMALS) {
  return TokenPayment.fungibleFromAmount('', amount, numDecimals).toString();
}
