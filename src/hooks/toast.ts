import { useToast } from "react-native-toast-notifications";

export const useSomeErrorToast = () => {
  const toast = useToast();

  const someErrorToast = () => {
    toast.show("何らかのエラーが発生しました", { type: "danger" });
  };

  return {
    someErrorToast,
  };
};
