import { useFormik } from 'formik';
import { useEffect, useRef } from 'react';
import { object, string } from 'yup';
import { useAccount } from './useAccount';
import { useAmountSchema } from './validation/useAmountSchema';
import { confirmRate } from '../../api/confirmRate';
import { getApiURL } from '../../helpers/getApiURL';
import { OptionType } from '../../types/form';
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
  firstToken?: OptionType;
  secondToken?: OptionType;
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
  onSubmit
}: {
  mvxAccountAddress?: string;
  nativeAuthToken?: string;
  firstAmount?: string;
  secondAmount?: string;
  fromChainId?: string;
  toChainId?: string;
  firstToken?: OptionType;
  secondToken?: OptionType;
  onSubmit: (transactions: ServerTransaction[]) => void;
}) => {
  const pendingSigningRef = useRef<boolean>();
  const account = useAccount();

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

    if (firstToken && secondToken) {
      sessionStorage.setItem(
        'prevFirstTokenId',
        values.firstToken?.token?.address ?? ''
      );
      sessionStorage.setItem(
        'prevSecondTokenId',
        values.secondToken?.token?.address ?? ''
      );
    }

    const { data } = await confirmRate({
      url: getApiURL(),
      nativeAuthToken: nativeAuthToken ?? '',
      body: {
        tokenIn: values.firstToken?.token?.address ?? '',
        amountIn: firstAmount?.toString() ?? '',
        fromChainId: values.fromChainId ?? '',
        tokenOut: values.secondToken?.token?.address ?? '',
        toChainId: values.toChainId ?? '',
        fee: '0',
        amountOut: secondAmount?.toString() ?? '',
        sender: account.address ?? '',
        receiver: mvxAccountAddress ?? ''
      }
    });

    const transactions = data;

    if (!transactions || transactions.length === 0) {
      pendingSigningRef.current = false;
      return;
    }

    resetSwapForm();
    onSubmit(transactions);
    pendingSigningRef.current = false;
  };

  const formik = useFormik({
    initialValues,
    validationSchema: object<TradeFormikValuesType>().shape({
      [BridgeFormikValuesEnum.firstAmount]: useAmountSchema(),
      [BridgeFormikValuesEnum.firstToken]: object().required(),
      [BridgeFormikValuesEnum.secondAmount]: string(),
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

  // useEffect(() => {
  //   setFieldValue(BridgeFormikValuesEnum.firstAmount, firstAmount, true);
  // }, [firstAmount]);

  useEffect(() => {
    setFieldValue(BridgeFormikValuesEnum.secondAmount, secondAmount, true);
  }, [secondAmount]);

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
    firstToken: firstToken?.token,
    secondToken: secondToken?.token,
    firstAmountError,
    secondAmountError,
    fromChainError,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetSwapForm,
    setFieldTouched
  };
};
