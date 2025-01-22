import { TokenDTO } from 'dto/Token.dto';

export type TokenType = TokenDTO & {
  balance?: string;
};

export type MvxTokenType = {
  identifier: string;
  ticker?: string;
  name: string;
  balance?: string;
  decimals?: number;
};
