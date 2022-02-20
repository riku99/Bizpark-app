import React, { useCallback, useMemo } from 'react';
import { Box } from 'native-base';
import {
  usePickedThoughtsQuery,
  useGetLikedThoughtsQuery,
  GetLikedThoughtsQuery,
} from 'src/generated/graphql';
import { Indicator } from 'src/components/Indicator';
import { List } from 'src/components/ThoughtList';
import { btoa } from 'react-native-quick-base64';
import { useMyId } from 'src/hooks/me';
import { ThoughtCard } from 'src/components/ThoughtCard';
import { InfiniteFlatList } from 'src/components/InfiniteFlatList';

type Item = GetLikedThoughtsQuery['user']['likedThoughts']['edges'][number];

export const PickedThoughts = React.memo(() => {
  const myId = useMyId();

  const { data, refetch, fetchMore } = useGetLikedThoughtsQuery({
    variables: {
      userId: myId,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const refresh = async () => {
    await refetch();
  };

  const infiniteLoad = async () => {
    const { pageInfo } = data.user.likedThoughts;
    if (pageInfo.hasNextPage) {
      const { endCursor } = pageInfo;

      await fetchMore({
        variables: {
          cursor: endCursor ? btoa(endCursor) : undefined,
        },
      });
    }
  };

  const listData = useMemo(() => {
    if (!data) {
      return;
    }

    return data.user.likedThoughts.edges.map((edge) => edge.node.thought);
  }, [data]);

  if (!listData) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1} pt={4} px={4}>
      <List data={listData} refresh={refresh} infiniteLoad={infiniteLoad} />
    </Box>
  );
});
