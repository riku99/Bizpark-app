import {
  createClient,
  Provider,
  errorExchange,
  dedupExchange,
  fetchExchange,
  cacheExchange,
} from "urql";
import React from "react";
import { useToast } from "react-native-toast-notifications";

type Props = {
  children: JSX.Element;
};

export const UrqlProvider = ({ children }: Props) => {
  const toast = useToast();

  const customErrorExchange = errorExchange({
    onError: (error) => {
      const firstError = error.graphQLErrors[0];

      if (error.networkError) {
        toast.show("ネットワークに接続されていません");
        return;
      }

      if (firstError.extensions.code === "INTERNAL_SERVER_ERROR") {
        // console.log(error.graphQLErrors[0].message);
        toast.show("何らかのエラーが発生しました", { type: "danger" });
        return;
      }

      // TODO: 認証エラー時のログアウト
    },
  });

  const client = createClient({
    url: "http://localhost:5001/bizpark-dev/asia-northeast1/graphql",
    exchanges: [
      dedupExchange,
      cacheExchange,
      customErrorExchange,
      fetchExchange,
    ],
    // fetchOptions: () => {
    //   console.log("hey");
    //   const token = "token";
    //   return {
    //     headers: { authorization: token ? `Bearer ${token}` : "" },
    //   };
    // },
  });

  return <Provider value={client}>{children}</Provider>;
};
