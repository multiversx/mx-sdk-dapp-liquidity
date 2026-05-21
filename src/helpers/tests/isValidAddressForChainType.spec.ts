import { ChainType } from '../../types/chainType';
import { isValidAddressForChainType } from '../isValidAddressForChainType';

describe('isValidAddressForChainType', () => {
  describe('EVM', () => {
    it('accepts a valid checksummed EVM address', () => {
      expect(
        isValidAddressForChainType(
          '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          ChainType.evm
        )
      ).toBe(true);
    });

    it('accepts a lowercase EVM address', () => {
      expect(
        isValidAddressForChainType(
          '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
          ChainType.evm
        )
      ).toBe(true);
    });

    it('rejects a non-EVM string', () => {
      expect(isValidAddressForChainType('not-an-address', ChainType.evm)).toBe(
        false
      );
    });
  });

  describe('MVX', () => {
    it('accepts a valid erd1 address', () => {
      expect(
        isValidAddressForChainType(
          'erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx',
          ChainType.mvx
        )
      ).toBe(true);
    });

    it('rejects an EVM address for MVX', () => {
      expect(
        isValidAddressForChainType(
          '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          ChainType.mvx
        )
      ).toBe(false);
    });
  });

  describe('Solana', () => {
    it('accepts a valid base58 Solana address', () => {
      expect(
        isValidAddressForChainType(
          '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          ChainType.sol
        )
      ).toBe(true);
    });

    it('rejects an invalid Solana address', () => {
      expect(isValidAddressForChainType('notasoladdr', ChainType.sol)).toBe(
        false
      );
    });
  });

  describe('Sui', () => {
    it('accepts a valid Sui address (0x + 64 hex chars)', () => {
      expect(
        isValidAddressForChainType('0x' + 'a'.repeat(64), ChainType.sui)
      ).toBe(true);
    });

    it('rejects an EVM-shaped address (0x + 40 hex chars) for Sui — the reported bug', () => {
      expect(
        isValidAddressForChainType(
          '0x2566c27aaafa46818c4d91fd4ab88137d26764fd',
          ChainType.sui
        )
      ).toBe(false);
    });

    it('rejects a non-hex string for Sui', () => {
      expect(isValidAddressForChainType('notasuiaddr', ChainType.sui)).toBe(
        false
      );
    });
  });

  describe('BTC', () => {
    it('accepts a valid bech32 mainnet address', () => {
      expect(
        isValidAddressForChainType(
          'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
          ChainType.btc
        )
      ).toBe(true);
    });

    it('accepts a valid legacy P2PKH address', () => {
      expect(
        isValidAddressForChainType(
          '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
          ChainType.btc
        )
      ).toBe(true);
    });

    it('rejects a garbage string for BTC', () => {
      expect(isValidAddressForChainType('notabtcaddr', ChainType.btc)).toBe(
        false
      );
    });
  });

  describe('edge cases', () => {
    it('returns true for undefined address (no constraint)', () => {
      expect(isValidAddressForChainType(undefined, ChainType.evm)).toBe(false);
    });

    it('returns true for undefined chainType (no constraint)', () => {
      expect(
        isValidAddressForChainType(
          '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          undefined
        )
      ).toBe(false);
    });
  });
});
