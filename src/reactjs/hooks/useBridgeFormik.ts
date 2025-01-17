import { useFormik } from 'formik';
import { useEffect } from 'react';
import { object, string } from 'yup';
import { useAccount } from './useAccount.ts';
import { confirmRate } from '../../api/confirmRate';
import { getApiURL } from '../../helpers/getApiURL';
import { OptionType } from '../../types/form';
import { ServerTransaction } from '../../types/transaction';

export enum TradeFormikValuesEnum {
  firstToken = 'firstToken',
  firstAmount = 'firstAmount',
  secondToken = 'secondToken',
  secondAmount = 'secondAmount',
  fromChain = 'fromChain'
}

export interface TradeFormikValuesType {
  firstAmount?: string;
  secondAmount?: string;
  firstToken?: OptionType;
  secondToken?: OptionType;
  fromChain?: string;
}

export const useBridgeFormik = ({
  nativeAuthToken,
  mvxAccountAddress,
  firstToken,
  firstAmount,
  secondToken,
  secondAmount,
  fromChain,
  onSubmit
}: {
  mvxAccountAddress?: string;
  nativeAuthToken?: string;
  firstAmount?: string;
  secondAmount?: string;
  fromChain?: string;
  firstToken?: OptionType;
  secondToken?: OptionType;
  onSubmit: (transactions: ServerTransaction[]) => void;
}) => {
  const account = useAccount();

  const initialValues: TradeFormikValuesType = {
    firstAmount: '',
    secondAmount: '',
    fromChain: fromChain ?? ''
  };

  const resetSwapForm = () => {
    formik.setTouched({}, false);
    setFieldValue(TradeFormikValuesEnum.firstAmount, '');
    setFieldValue(TradeFormikValuesEnum.secondAmount, '');
  };

  const onSubmitFormik = async (values: TradeFormikValuesType) => {
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

    const { data: transactions } = await confirmRate({
      url: getApiURL(),
      nativeAuthToken: nativeAuthToken ?? '',
      body: {
        tokenIn: values.firstToken?.token?.address ?? '',
        amountIn: firstAmount?.toString() ?? '',
        fromChain: values.fromChain ?? '',
        tokenOut: values.secondToken?.token?.address ?? '',
        toChain: 'mvx',
        fee: '0',
        amountOut: secondAmount?.toString() ?? '',
        sender: account.address ?? '',
        receiver: mvxAccountAddress ?? ''
      }
    });

    if (!transactions) {
      return;
    }

    resetSwapForm();
    onSubmit(transactions);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: object().shape({
      [TradeFormikValuesEnum.firstToken]: object().required(),
      [TradeFormikValuesEnum.secondToken]: object().required(),
      [TradeFormikValuesEnum.fromChain]: string().required()
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
    setFieldValue(TradeFormikValuesEnum.firstAmount, firstAmount, true);
  }, [firstAmount]);

  useEffect(() => {
    setFieldValue(TradeFormikValuesEnum.secondAmount, secondAmount, true);
  }, [secondAmount]);

  useEffect(() => {
    setFieldValue(TradeFormikValuesEnum.firstToken, firstToken, true);
  }, [firstToken]);

  useEffect(() => {
    setFieldValue(TradeFormikValuesEnum.secondToken, secondToken, true);
  }, [secondToken]);

  useEffect(() => {
    setFieldValue(TradeFormikValuesEnum.fromChain, fromChain, true);
  }, [fromChain]);

  const secondAmountError =
    TradeFormikValuesEnum.secondAmount in errors &&
    TradeFormikValuesEnum.secondAmount in touched
      ? errors.secondAmount
      : undefined;

  const firstAmountError =
    TradeFormikValuesEnum.firstAmount in errors &&
    TradeFormikValuesEnum.firstAmount in touched
      ? errors.firstAmount
      : undefined;

  const fromChainError =
    TradeFormikValuesEnum.fromChain in errors &&
    TradeFormikValuesEnum.fromChain in touched
      ? errors.fromChain
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
