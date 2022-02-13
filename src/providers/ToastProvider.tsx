import { ToastProvider as FastToastProvider } from 'react-native-toast-notifications';
import React from 'react';
import { Dimensions } from 'react-native';

type Props = {
  children: JSX.Element;
};

export const ToastProvider = ({ children }: Props) => {
  return (
    <FastToastProvider
      offset={TOAST_OFFSET}
      style={{ width: TOAST_WIDTH }}
      duration={2500}
    >
      {children}
    </FastToastProvider>
  );
};

const { width, height } = Dimensions.get('screen');
const TOAST_WIDTH = width * 0.9;
const TOAST_OFFSET = height * 0.1;
