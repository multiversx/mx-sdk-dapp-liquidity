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

export const useChainIcon = (
  identifier:
    | keyof typeof msx
    | keyof typeof ethereum
    | keyof typeof binance
    | keyof typeof polygon
    | keyof typeof base
    | string
) => {
  const identifiers = { ...msx, ...ethereum, ...binance, ...polygon, ...base };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return identifiers[identifier] || Default;
};
