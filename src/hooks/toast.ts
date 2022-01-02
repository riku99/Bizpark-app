import { useToast } from "react-native-toast-notifications";

export const useCustomToast = () => {
  const toast = useToast();

  const someErrorToast = () => {
    toast.show("何らかのエラーが発生しました", { type: "danger" });
  };

  const noDataToast = () => {
    toast.show("データが存在しません");
  };

  return {
    someErrorToast,
    noDataToast,
  };
};
