import { useCallback, useMemo } from 'react';
import { useThoughtsQuery, Genre } from 'src/generated/graphql';
import { btoa } from 'react-native-quick-base64';

export const useThoughtFeed = ({ genre }: { genre: Genre }) => {
  const { data, refetch, fetchMore } = useThoughtsQuery({
    variables: {
      genre,
    },
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
          genre,
          cursor: cursor ? btoa(cursor) : undefined,
        },
      });
    }
  }, [
    data?.thoughts.pageInfo.endCursor,
    data?.thoughts.pageInfo.hasNextPage,
    fetchMore,
    genre,
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
