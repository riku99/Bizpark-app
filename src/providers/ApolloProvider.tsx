import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloProviderBase,
  from,
  split,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import React, { useState, useEffect } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { CustomErrorResponseCode } from 'src/generated/graphql';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { relayStylePagination } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { useCustomToast } from 'src/hooks/toast';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache, AsyncStorageWrapper } from 'apollo3-cache-persist';
import { useLoggedIn } from 'src/hooks/me';

type Props = {
  children: JSX.Element;
};

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
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
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
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
        thoughts: relayStylePagination(['genre']), // genreが異なっていたら異なるキャッシュとして管理
        news: relayStylePagination(['genre']),
        follows: relayStylePagination(['q']),
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
              __typename: 'ThoughtTalkRoom',
              id: args.id,
            });
          },
        },
        newsTalkRooms: {
          merge: (existing = [], incoming) => {
            return incoming;
          },
        },
        newsTalkRoom: {
          read: (_, { args, toReference }) => {
            return toReference({
              __typename: 'NewsTalkRoom',
              id: args.id,
            });
          },
        },
        oneNews: {
          read: (_, { args, toReference }) => {
            return toReference({
              __typename: 'News',
              id: args.id,
            });
          },
        },
        thought: {
          read: (_, { args, toReference }) => {
            return toReference({
              __typename: 'Thought',
              id: args.id,
            });
          },
        },
        pickedNews: relayStylePagination(),
        pickedThoughts: relayStylePagination(),
        oneOnOneTalkRooms: {
          merge: (existing = [], incoming) => {
            return incoming;
          },
        },
        oneOnOneTalkRoom: {
          read: (_, { args, toReference }) => {
            return toReference({
              __typename: 'OneOnOneTalkRoom',
              id: args.id,
            });
          },
        },
        userThoughts: relayStylePagination(['userId']),
      },
    },
    ThoughtTalkRoom: {
      fields: {
        messages: relayStylePagination(),
        members: relayStylePagination(),
      },
    },
    NewsTalkRoom: {
      fields: {
        messages: relayStylePagination(),
        members: relayStylePagination(),
      },
    },
    OneOnOneTalkRoom: {
      fields: {
        messages: relayStylePagination(),
      },
    },
  },
});

export const ApolloProvider = ({ children }: Props) => {
  const toast = useToast();
  const { someErrorToast } = useCustomToast();

  const { setLoggedIn } = useLoggedIn();

  const errorLink = onError((error) => {
    try {
      const firstError = error.graphQLErrors[0];
      const code = firstError.extensions.code;

      console.log('This log is output from errorLink');
      console.error(code);
      console.log(firstError.message);

      if (error.networkError) {
        toast.show('ネットワークに接続されていません');
        return;
      }

      if (code === 'INTERNAL_SERVER_ERROR') {
        someErrorToast();
        return;
      }

      if (code === CustomErrorResponseCode.AlreadyUserExisting) {
        toast.show('既にユーザーが存在しています', { type: 'danger' });
        return;
      }

      if (code === 'FORBIDDEN') {
        Alert.alert('エラーが発生しました', 'ログインし直してください', [
          {
            onPress: async () => {
              setLoggedIn(false);
              await auth().signOut();
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

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    (async () => {
      await persistCache({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
      });

      setClient(
        new ApolloClient({
          link: from([errorLink, authLink, splitLink]),
          cache,
        })
      );
    })();
  }, []);

  if (!client) {
    return null;
  }

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
};
