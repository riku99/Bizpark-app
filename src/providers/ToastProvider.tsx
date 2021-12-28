import { ToastProvider as FastToastProvider } from "react-native-toast-notifications";
import React from "react";

type Props = {
  children: JSX.Element;
};

export const ToastProvider = ({ children }: Props) => {
  return <FastToastProvider>{children}</FastToastProvider>;
};
