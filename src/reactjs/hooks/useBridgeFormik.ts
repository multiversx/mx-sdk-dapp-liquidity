import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useSwitchChain } from 'wagmi';
import { object, string } from 'yup';
import { useAccount } from './useAccount';
import { useAmountSchema } from './validation/useAmountSchema';
import { useSecondAmountSchema } from './validation/useSecondAmountSchema';
import { confirmRate } from '../../api/confirmRate';
import { getApiURL } from '../../helpers/getApiURL';
import { RateRequestResponse } from '../../types';
import { ProviderType } from '../../types/providerType';
import { TokenType } from '../../types/token';
import { ServerTransaction } from '../../types/transaction';

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
  nativeAuthToken,
  mvxAccountAddress,
  firstToken,
  firstAmount,
  secondToken,
  secondAmount,
  fromChainId,
  toChainId,
  rate,
  onSubmit
}: {
  mvxAccountAddress?: string;
  nativeAuthToken?: string;
  firstAmount?: string;
  secondAmount?: string;
  fromChainId?: string;
  toChainId?: string;
  firstToken?: TokenType;
  secondToken?: TokenType;
  rate?: RateRequestResponse;
  onSubmit: ({
    transactions,
    provider
  }: {
    transactions: ServerTransaction[];
    provider: ProviderType;
  }) => void;
}) => {
  const [lastChangedField, setLastChangedField] = useState<
    | BridgeFormikValuesEnum.firstAmount
    | BridgeFormikValuesEnum.secondAmount
    | null
  >(null);
  const pendingSigningRef = useRef<boolean>();
  const account = useAccount();
  const { switchChainAsync } = useSwitchChain();

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
    if (values.fromChainId) {
      await switchChainAsync({
        chainId: Number(values.fromChainId)
      });
    }

    if (pendingSigningRef.current) {
      return;
    }
    pendingSigningRef.current = true;

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
        sender: account.address ?? '',
        receiver: mvxAccountAddress ?? '',
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

    resetSwapForm();
    onSubmit({
      transactions,
      provider: rate?.provider ?? ProviderType.None
    });
    pendingSigningRef.current = false;
  };

  const formik = useFormik({
    initialValues,
    validationSchema: object<TradeFormikValuesType>().shape({
      [BridgeFormikValuesEnum.firstAmount]: useAmountSchema(),
      [BridgeFormikValuesEnum.firstToken]: object().required(),
      [BridgeFormikValuesEnum.secondAmount]: useSecondAmountSchema(),
      [BridgeFormikValuesEnum.secondToken]: object().required(),
      [BridgeFormikValuesEnum.fromChainId]: string().required(),
      [BridgeFormikValuesEnum.toChainId]: string().required()
    }),
    onSubmit: onSubmitFormik
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue,
    setFieldTouched
  } = formik;

  useEffect(() => {
    console.log('useBridgeFormik -> first amount set');

    if (!values.firstAmount && touched.firstAmount) {
      setFieldValue(BridgeFormikValuesEnum.secondAmount, 0, true);
      return;
    }

    if (
      lastChangedField === 'firstAmount' &&
      values.firstAmount &&
      values.firstAmount !== '' &&
      rate?.fee &&
      rate.fee !== '0'
    ) {
      const calculatedSecondAmount =
        parseFloat(values.firstAmount) - Number(rate.fee);
      setFieldValue(
        BridgeFormikValuesEnum.secondAmount,
        calculatedSecondAmount > 0 ? calculatedSecondAmount : '0'
      );
    }
  }, [values.firstAmount, rate?.fee, lastChangedField, touched.firstAmount]);

  useEffect(() => {
    console.log('useBridgeFormik -> first amount set');

    if (!values.secondAmount && touched.secondAmount) {
      setFieldValue(BridgeFormikValuesEnum.firstAmount, 0, true);
      return;
    }

    if (
      lastChangedField === 'secondAmount' &&
      values.secondAmount &&
      values.secondAmount !== '' &&
      rate?.fee &&
      rate.fee !== '0'
    ) {
      const calculatedFirstAmount =
        parseFloat(values.secondAmount) + Number(rate.fee);
      setFieldValue(BridgeFormikValuesEnum.firstAmount, calculatedFirstAmount);
    }
  }, [values.secondAmount, rate?.fee, lastChangedField, touched.secondAmount]);

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.firstToken, firstToken, true);
  }, [firstToken]);

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.secondToken, secondToken, true);
  }, [secondToken]);

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.fromChainId, fromChainId, true);
  }, [fromChainId]);

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.toChainId, toChainId, true);
  }, [toChainId]);

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
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetSwapForm,
    setFieldTouched,
    setLastChangedField
  };
};
