import Base from '../assets/base.svg';
import Bsc from '../assets/bsc.svg';
import Default from '../assets/default.svg';
import Ethereum from '../assets/ethereum.svg';
import MultiversX from '../assets/msx.svg';
import Polygon from '../assets/polygon.svg';

const msx = {
  msx: MultiversX,
  MultiversX
};

const ethereum = {
  ethereum: Ethereum,
  Ethereum
};

const binance = {
  bsc: Bsc,
  BSC: Bsc
};

const polygon = {
  polygon: Polygon,
  POLYGON: Polygon
};

const base = {
  base: Base,
  BASE: Base
};

export type ChainNameType =
  | keyof typeof msx
  | keyof typeof ethereum
  | keyof typeof binance
  | keyof typeof polygon
  | keyof typeof base
  | 'default';

export const chainIdentifier = {
  ...msx,
  ...ethereum,
  ...binance,
  ...polygon,
  ...base,
  default: Default
};

export const ALL_NETWORK_ID = '-1';
