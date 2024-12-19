import { TokenDTO } from 'dto/Token.dto';

export type TokenType = TokenDTO & {
  balance?: string;
};
