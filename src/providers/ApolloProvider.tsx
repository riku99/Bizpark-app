import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloProviderBase,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:5001/bizpark-dev/asia-northeast1/graphql",
  cache: new InMemoryCache(),
});

type Props = {
  children: JSX.Element;
};

export const ApolloProvider = ({ children }: Props) => {
  return <ApolloProvider>{children}</ApolloProvider>;
};
