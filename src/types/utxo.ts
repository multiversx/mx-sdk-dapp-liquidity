export interface Utxo {
  txid: string;
  vout: number;
  value: string;
  height?: number;
  confirmations: number;
  address?: string;
  path?: string;
  lockTime?: number;
  coinbase?: boolean;
}
