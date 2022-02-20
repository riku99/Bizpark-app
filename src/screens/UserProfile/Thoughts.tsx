import React, { useMemo } from 'react';
import { useUserThoughtsQuery } from 'src/generated/graphql';
import { btoa } from 'react-native-quick-base64';
import { Indicator } from 'src/components/Indicator';
import { Box } from 'native-base';
import { List } from 'src/components/ThoughtList';
import { StyleSheet } from 'react-native';

type Props = {
  id: string;
};

export const Thoughts = React.memo(({ id }: Props) => {
  const { data, refetch, fetchMore } = useUserThoughtsQuery({
    variables: {
      userId: id,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const listData = useMemo(() => {
    if (!data) {
      return;
    }

    return data.userThoughts.edges.map((edge) => edge.node);
  }, [data]);

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

  if (!listData) {
    return <Indicator style={styles.indicator} />;
  }

  return (
    <Box flex={1} px="4" pt="4">
      <List data={listData} refresh={refresh} infiniteLoad={infiniteLoad} />
    </Box>
  );
});

const styles = StyleSheet.create({
  indicator: {
    marginTop: 10,
  },
});
