import {
  ConfirmRateError,
  MissingConfirmRateDataError
} from '../../types/errors';
import { assertConfirmRateData } from '../assertConfirmRateData';

const VALID_PARAMS = {
  nativeAuthToken: 'valid-token',
  orderId: 'order-123',
  fromChainId: '1',
  toChainId: '44',
  sender: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  receiver: 'erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx'
};

describe('assertConfirmRateData', () => {
  it('does not throw when all required fields are present', () => {
    expect(() => assertConfirmRateData(VALID_PARAMS)).not.toThrow();
  });

  describe('ConfirmRateError — system token missing', () => {
    it('throws ConfirmRateError when nativeAuthToken is missing', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, nativeAuthToken: undefined })
      ).toThrow(ConfirmRateError);
    });

    it('throws ConfirmRateError when nativeAuthToken is empty string', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, nativeAuthToken: '' })
      ).toThrow(ConfirmRateError);
    });

    it('throws ConfirmRateError when orderId is missing', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, orderId: undefined })
      ).toThrow(ConfirmRateError);
    });

    it('throws ConfirmRateError when orderId is empty string', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, orderId: '' })
      ).toThrow(ConfirmRateError);
    });
  });

  describe('MissingConfirmRateDataError — required form field missing', () => {
    it('throws MissingConfirmRateDataError when fromChainId is missing', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, fromChainId: undefined })
      ).toThrow(MissingConfirmRateDataError);
    });

    it('throws MissingConfirmRateDataError when toChainId is missing', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, toChainId: undefined })
      ).toThrow(MissingConfirmRateDataError);
    });

    it('throws MissingConfirmRateDataError when sender is missing', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, sender: undefined })
      ).toThrow(MissingConfirmRateDataError);
    });

    it('throws MissingConfirmRateDataError when sender is empty string', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, sender: '' })
      ).toThrow(MissingConfirmRateDataError);
    });

    it('throws MissingConfirmRateDataError when receiver is missing', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, receiver: undefined })
      ).toThrow(MissingConfirmRateDataError);
    });

    it('throws MissingConfirmRateDataError when receiver is empty string', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, receiver: '' })
      ).toThrow(MissingConfirmRateDataError);
    });

    it('error message names the missing field (fromChainId)', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, fromChainId: '' })
      ).toThrow(/source chain/i);
    });

    it('error message names the missing field (sender)', () => {
      expect(() =>
        assertConfirmRateData({ ...VALID_PARAMS, sender: '' })
      ).toThrow(/sender/i);
    });
  });

  describe('error priority — system tokens are checked before form fields', () => {
    it('throws ConfirmRateError (not MissingConfirmRateDataError) when both nativeAuthToken and sender are missing', () => {
      expect(() =>
        assertConfirmRateData({
          ...VALID_PARAMS,
          nativeAuthToken: '',
          sender: ''
        })
      ).toThrow(ConfirmRateError);
    });
  });
});
