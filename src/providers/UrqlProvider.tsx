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
import { CustomErrorResponseCode } from "src/generated/graphql";

type Props = {
  children: JSX.Element;
};

export const UrqlProvider = ({ children }: Props) => {
  const toast = useToast();

  const customErrorExchange = errorExchange({
    onError: (error) => {
      const firstError = error.graphQLErrors[0];
      const code = firstError.extensions.code;

      if (error.networkError) {
        toast.show("ネットワークに接続されていません");
        return;
      }

      if (code === "INTERNAL_SERVER_ERROR") {
        // console.log(error.graphQLErrors[0].message);
        toast.show("何らかのエラーが発生しました", { type: "danger" });
        return;
      }

      if (code === CustomErrorResponseCode.AlreadyUserExisting) {
        toast.show("既にユーザーが存在しています", { type: "danger" });
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
