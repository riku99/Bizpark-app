import React, { useMemo } from 'react';
import { Box } from 'native-base';
import { useGetLikedThoughtsQuery } from 'src/generated/graphql';
import { Indicator } from 'src/components/Indicator';
import { List } from 'src/components/ThoughtList';
import { btoa } from 'react-native-quick-base64';
import { useMyId } from 'src/hooks/me';
import { StyleSheet } from 'react-native';

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
    if (data?.userResult.__typename === 'User') {
      const { pageInfo } = data.userResult.likedThoughts;
      if (pageInfo.hasNextPage) {
        const { endCursor } = pageInfo;

        await fetchMore({
          variables: {
            cursor: endCursor ? btoa(endCursor) : undefined,
          },
        });
      }
    }
  };

  const listData = useMemo(() => {
    if (!data || data.userResult.__typename !== 'User') {
      return;
    }

    return data.userResult.likedThoughts.edges.map((edge) => edge.node.thought);
  }, [data]);

  if (!listData) {
    return <Indicator style={styles.indicator} />;
  }

  return (
    <Box flex={1} pt={4} px={4}>
      <List data={listData} refresh={refresh} infiniteLoad={infiniteLoad} />
    </Box>
  );
});

const styles = StyleSheet.create({
  indicator: {
    marginTop: 10,
  },
});
