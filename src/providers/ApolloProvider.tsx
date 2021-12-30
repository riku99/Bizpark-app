import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloProviderBase,
  from,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import React from "react";
import { useToast } from "react-native-toast-notifications";
import { CustomErrorResponseCode } from "src/generated/graphql";

type Props = {
  children: JSX.Element;
};

const httpLink = new HttpLink({
  uri: "http://localhost:5001/bizpark-dev/asia-northeast1/graphql",
});

export const ApolloProvider = ({ children }: Props) => {
  const toast = useToast();

  const errorLink = onError((error) => {
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
  });

  const client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
};
