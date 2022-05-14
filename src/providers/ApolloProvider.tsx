import {
  ApolloClient,
  ApolloProvider as ApolloProviderBase,
  from,
  InMemoryCache,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import {
  getMainDefinition,
  relayStylePagination,
} from '@apollo/client/utilities';
import auth from '@react-native-firebase/auth';
import { createUploadLink } from 'apollo-upload-client';
import React from 'react';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import { useToast } from 'react-native-toast-notifications';
import { CustomErrorResponseCode } from 'src/generated/graphql';
import { useLoggedIn } from 'src/hooks/me';

type Props = {
  children: JSX.Element;
};

const uploadLink = createUploadLink({
  // uri: Config.APP_ENDPOINT,
  uri: 'http://172.20.10.3:4000/graphql',
});

const wsLink = new WebSocketLink({
  uri: Config.APP_WS_ENDPOINT,
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
        notifications: relayStylePagination(),
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
    User: {
      fields: {
        pickedNews: relayStylePagination(),
      },
    },
  },
});

export const ApolloProvider = ({ children }: Props) => {
  const toast = useToast();
  const { setLoggedIn } = useLoggedIn();

  const errorLink = onError((error) => {
    try {
      const firstError = error.graphQLErrors[0];
      const code = firstError.extensions.code;

      console.log('This log is output from errorLink');
      console.log(firstError.message);

      if (error.networkError) {
        toast.show('ネットワークに接続されていません');
        return;
      }

      if (code === 'INTERNAL_SERVER_ERROR') {
        console.log('some error');
        toast.show('何らかのエラーが発生しました', { type: 'danger' });
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

  const client = new ApolloClient({
    link: from([errorLink, authLink, splitLink]),
    cache,
  });

  if (!client) {
    return null;
  }

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
};
