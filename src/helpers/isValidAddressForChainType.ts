import { PublicKey } from '@solana/web3.js';
import { address as btcAddress, networks } from 'bitcoinjs-lib';
import { isAddress as isEvmAddress } from 'viem';
import { ChainType } from '../types/chainType';

// MVX bech32 addresses: prefix 'erd1', 58 bech32 chars, total 62 chars
const MVX_ADDRESS_REGEX = /^erd1[0-9a-z]{58}$/;
// Sui normalized addresses: 0x + exactly 64 hex chars (32 bytes)
const SUI_ADDRESS_REGEX = /^0x[0-9a-fA-F]{64}$/;

export const isValidAddressForChainType = (
  address: string | undefined,
  chainType: ChainType | undefined
): boolean => {
  if (!address || !chainType) {
    return false;
  }
  try {
    switch (chainType) {
      case ChainType.evm:
        return isEvmAddress(address);
      case ChainType.mvx:
        return MVX_ADDRESS_REGEX.test(address);
      case ChainType.sol:
        try {
          new PublicKey(address);
          return true;
        } catch {
          return false;
        }
      case ChainType.sui:
        return SUI_ADDRESS_REGEX.test(address);
      case ChainType.btc:
        try {
          btcAddress.toOutputScript(address, networks.bitcoin);
          return true;
        } catch {
          return false;
        }
      default:
        return false;
    }
  } catch {
    return false;
  }
};
