import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloProviderBase,
  from,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import React from "react";
import { useToast } from "react-native-toast-notifications";
import { CustomErrorResponseCode } from "src/generated/graphql";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import { signOut } from "src/helpers/auth";
import { relayStylePagination } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { useCustomToast } from "src/hooks/toast";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
type Props = {
  children: JSX.Element;
};

const uploadLink = createUploadLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: async () => {
      const currentUser = auth().currentUser;
      const idToken = await currentUser.getIdToken();

      return {
        authToken: `Bearer ${idToken}`,
      };
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  uploadLink
);

const authLink = setContext(async (_, { headers }) => {
  const currentUser = auth().currentUser;
  if (currentUser) {
    const idToken = await currentUser.getIdToken();
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${idToken}`,
      },
    };
  } else {
    return {
      headers: {
        ...headers,
      },
    };
  }
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        thoughts: relayStylePagination(["genre"]), // genreが異なっていたら異なるキャッシュとして管理
        news: relayStylePagination(["genre"]),
        follows: relayStylePagination(["q"]),
        blockingUsers: {
          merge: (existing = [], incoming) => {
            return incoming;
          },
        },
        thoughtTalkRooms: {
          merge: (existing = [], incoming) => {
            return incoming;
          },
        },
        thoughtTalkRoom: {
          read: (_, { args, toReference }) => {
            return toReference({
              __typename: "ThoughtTalkRoom",
              id: args.id,
            });
          },
        },
        newsTalkRoom: {
          read: (_, { args, toReference }) => {
            return toReference({
              __typename: "NewsTalkRoom",
              id: args.id,
            });
          },
        },
      },
    },
    ThoughtTalkRoom: {
      fields: {
        messages: relayStylePagination(),
        members: relayStylePagination(),
      },
    },
  },
});

export const ApolloProvider = ({ children }: Props) => {
  const toast = useToast();
  const { someErrorToast } = useCustomToast();

  const errorLink = onError((error) => {
    try {
      const firstError = error.graphQLErrors[0];
      const code = firstError.extensions.code;

      console.log("This log is output from errorLink");
      console.error(code);
      console.log(firstError.message);

      if (error.networkError) {
        toast.show("ネットワークに接続されていません");
        return;
      }

      if (code === "INTERNAL_SERVER_ERROR") {
        someErrorToast();
        return;
      }

      if (code === CustomErrorResponseCode.AlreadyUserExisting) {
        toast.show("既にユーザーが存在しています", { type: "danger" });
        return;
      }

      if (code === "FORBIDDEN") {
        Alert.alert("エラーが発生しました", "ログインし直してください", [
          {
            onPress: async () => {
              await signOut();
            },
          },
        ]);
        return;
      }

      console.log(error);
    } catch (e) {
      console.log(e);
    }
  });

  const client = new ApolloClient({
    link: from([errorLink, authLink, splitLink]),
    cache,
  });

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
};
