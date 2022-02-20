import React, { useMemo } from 'react';
import { Box } from 'native-base';
import { useUserThoughtsQuery } from 'src/generated/graphql';
import { List } from 'src/components/ThoughtList';
import { Indicator } from 'src/components/Indicator';
import { btoa } from 'react-native-quick-base64';
import { useMyId } from 'src/hooks/me';
import { StyleSheet } from 'react-native';

export const Thouhgts = React.memo(() => {
  const myId = useMyId();

  const { data, refetch, fetchMore } = useUserThoughtsQuery({
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
    const { pageInfo } = data.userThoughts;
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

    return data.userThoughts.edges.map((edge) => edge.node);
  }, [data]);

  if (!listData) {
    return <Indicator style={styles.Indicator} />;
  }

  return (
    <Box flex={1} px="4" pt="4">
      <List data={listData} refresh={refresh} infiniteLoad={infiniteLoad} />
    </Box>
  );
});

const styles = StyleSheet.create({
  Indicator: {
    marginTop: 10,
  },
});
