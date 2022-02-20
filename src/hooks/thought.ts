import { useCallback, useMemo } from 'react';
import {
  useThoughtsQuery,
  ThoughtsQueryVariables,
} from 'src/generated/graphql';
import { btoa } from 'react-native-quick-base64';

export const useThoughtFeed = (variables: ThoughtsQueryVariables) => {
  const { data, refetch, fetchMore } = useThoughtsQuery({
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const infiniteLoad = useCallback(async () => {
    if (data.thoughts.pageInfo.hasNextPage) {
      const cursor = data.thoughts.pageInfo.endCursor;
      await fetchMore({
        variables: {
          ...variables,
          cursor: cursor ? btoa(cursor) : undefined,
        },
      });
    }
  }, [
    data?.thoughts.pageInfo.endCursor,
    data?.thoughts.pageInfo.hasNextPage,
    fetchMore,
    variables,
  ]);

  const listData = useMemo(() => {
    if (!data) {
      return;
    }

    return data.thoughts.edges.map((edge) => edge.node);
  }, [data]);

  return {
    listData,
    refresh,
    infiniteLoad,
  };
};
