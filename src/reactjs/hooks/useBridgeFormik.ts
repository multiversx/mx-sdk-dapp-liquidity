import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { object, string } from 'yup';
import { useAmountSchema } from './validation/useAmountSchema';
import { useSecondAmountSchema } from './validation/useSecondAmountSchema';
import { confirmRate } from '../../api/confirmRate';
import { assertConfirmRateData } from '../../helpers/assertConfirmRateData';
import { assertRateConfirmationMatchesIntent } from '../../helpers/assertRateConfirmationMatchesIntent';
import { getApiURL } from '../../helpers/getApiURL';
import { isValidAddressForChainType } from '../../helpers/isValidAddressForChainType';
import { RateRequestResponse } from '../../types';
import { ChainType } from '../../types/chainType';
import {
  ConfirmRateError,
  MissingConfirmRateDataError
} from '../../types/errors';
import { ProviderType } from '../../types/providerType';
import { TokenType } from '../../types/token';
import { ServerTransaction } from '../../types/transaction';
import { useWeb3App } from '../context/useWeb3App';

export enum BridgeFormikValuesEnum {
  firstToken = 'firstToken',
  firstAmount = 'firstAmount',
  secondToken = 'secondToken',
  secondAmount = 'secondAmount',
  fromChainId = 'fromChainId',
  toChainId = 'toChainId'
}

export interface TradeFormikValuesType {
  firstAmount?: string;
  secondAmount?: string;
  firstToken?: TokenType;
  secondToken?: TokenType;
  fromChainId?: string;
  toChainId?: string;
}

export const useBridgeFormik = ({
  sender,
  receiver,
  firstToken,
  firstAmount,
  secondToken,
  secondAmount,
  fromChainId,
  toChainId,
  setForceRefetchRate,
  rate,
  onSubmit,
  isMvxConnected,
  senderChainType,
  receiverChainType
}: {
  sender: string;
  receiver: string;
  firstAmount?: string;
  secondAmount?: string;
  fromChainId?: string;
  toChainId?: string;
  firstToken?: TokenType;
  secondToken?: TokenType;
  isMvxConnected: boolean;
  senderChainType?: ChainType;
  receiverChainType?: ChainType;
  setForceRefetchRate?: (value: (previous: number) => number) => void;
  rate?: RateRequestResponse;
  onSubmit: ({
    transactions,
    provider
  }: {
    transactions: ServerTransaction[];
    provider: ProviderType;
  }) => void;
}) => {
  const pendingSigningRef = useRef<boolean>();
  const { nativeAuthToken } = useWeb3App();
  const [confirmRateError, setConfirmRateError] = useState<string | undefined>(
    undefined
  );

  const isSenderValid =
    !sender || !senderChainType
      ? true
      : isValidAddressForChainType(sender, senderChainType);
  const isReceiverValid =
    !receiver || !receiverChainType
      ? true
      : isValidAddressForChainType(receiver, receiverChainType);

  const senderAddressError =
    sender && !isSenderValid
      ? `Invalid ${senderChainType} sender address`
      : undefined;
  const receiverAddressError =
    receiver && !isReceiverValid
      ? `Invalid ${receiverChainType} receiver address`
      : undefined;

  const initialValues: TradeFormikValuesType = {
    firstAmount: '',
    secondAmount: '',
    fromChainId: fromChainId ?? '',
    toChainId: toChainId ?? ''
  };

  const resetSwapForm = () => {
    formik.setTouched({}, false);
    formik.setErrors({});
    setFieldValue(BridgeFormikValuesEnum.firstAmount, '');
    setFieldValue(BridgeFormikValuesEnum.secondAmount, '');
  };

  const onSubmitFormik = async (values: TradeFormikValuesType) => {
    if (pendingSigningRef.current) {
      return;
    }
    pendingSigningRef.current = true;
    setConfirmRateError(undefined);

    try {
      if (!isSenderValid || !isReceiverValid) {
        pendingSigningRef.current = false;
        return;
      }

      assertConfirmRateData({
        nativeAuthToken,
        orderId: rate?.orderId,
        fromChainId: values.fromChainId,
        toChainId: values.toChainId,
        sender,
        receiver
      });

      const { data } = await confirmRate({
        url: getApiURL(),
        nativeAuthToken: nativeAuthToken ?? '',
        body: {
          tokenIn: values.firstToken?.address ?? '',
          amountIn: firstAmount?.toString() ?? '',
          fromChainId: values.fromChainId ?? '',
          tokenOut: values.secondToken?.address ?? '',
          toChainId: values.toChainId ?? '',
          amountOut: secondAmount?.toString() ?? '',
          sender: sender ?? '',
          receiver: receiver ?? '',
          fee: rate?.fee ?? '0',
          provider: rate?.provider ?? ProviderType.None,
          orderId: rate?.orderId ?? ''
        }
      });

      const transactions = data;

      if (!transactions || transactions.length === 0) {
        pendingSigningRef.current = false;
        return;
      }

      assertRateConfirmationMatchesIntent(
        { fromChainId: values.fromChainId ?? '', sender: sender ?? '' },
        transactions
      );

      resetSwapForm();
      onSubmit({
        transactions,
        provider: rate?.provider ?? ProviderType.None
      });
    } catch (error) {
      console.error('Error confirming rate:', error);
      if (
        error instanceof ConfirmRateError ||
        error instanceof MissingConfirmRateDataError
      ) {
        setConfirmRateError((error as Error).message);
      } else {
        setForceRefetchRate?.((prevState) => prevState + 1);
      }
    } finally {
      pendingSigningRef.current = false;
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: object<TradeFormikValuesType>().shape({
      [BridgeFormikValuesEnum.firstAmount]: useAmountSchema({ isMvxConnected }),
      [BridgeFormikValuesEnum.firstToken]: object().required(),
      [BridgeFormikValuesEnum.secondAmount]: useSecondAmountSchema(),
      [BridgeFormikValuesEnum.secondToken]: object().required(),
      [BridgeFormikValuesEnum.fromChainId]: string().required(),
      [BridgeFormikValuesEnum.toChainId]: string().required()
    }),
    onSubmit: onSubmitFormik
  });

  const {
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue,
    setFieldTouched
  } = formik;

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.firstToken, firstToken, true);
  }, [firstToken, setFieldValue]);

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.secondToken, secondToken, true);
  }, [secondToken, setFieldValue]);

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.fromChainId, fromChainId, true);
  }, [fromChainId, setFieldValue]);

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.toChainId, toChainId, true);
  }, [toChainId, setFieldValue]);

  const secondAmountError =
    BridgeFormikValuesEnum.secondAmount in errors &&
    BridgeFormikValuesEnum.secondAmount in touched
      ? errors.secondAmount
      : undefined;

  const firstAmountError =
    BridgeFormikValuesEnum.firstAmount in errors &&
    BridgeFormikValuesEnum.firstAmount in touched
      ? errors.firstAmount
      : undefined;

  const fromChainError =
    BridgeFormikValuesEnum.fromChainId in errors &&
    BridgeFormikValuesEnum.fromChainId in touched
      ? errors.fromChainId
      : undefined;

  return {
    formik,
    errors,
    touched,
    firstToken,
    secondToken,
    firstAmountError,
    secondAmountError,
    fromChainError,
    senderAddressError,
    receiverAddressError,
    confirmRateError,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetSwapForm,
    setFieldTouched
  };
};
