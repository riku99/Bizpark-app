import React from 'react';
import { Box, VStack } from 'native-base';
import { useThoughtsQuery } from 'src/generated/graphql';
import { Indicator } from 'src/components/Indicator';
import { btoa } from 'react-native-quick-base64';
import { List } from '../../components/ThoughtList';
import { Bg } from 'src/components/Bg';

export const Follow = React.memo(() => {
  const { data, refetch, fetchMore } = useThoughtsQuery({
    variables: { follow: true },
  });

  const refresh = async () => {
    await refetch();
  };

  const infiniteLoad = async () => {
    if (data.thoughts.pageInfo.hasNextPage) {
      const cursor = data.thoughts.pageInfo.endCursor;
      await fetchMore({
        variables: {
          follow: true,
          cursor: cursor ? btoa(cursor) : undefined,
        },
      });
    }
  };
  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }
  return (
    <Bg flex={1} pt={4} w="100%" h="100%">
      <VStack px={4}>
        <List
          data={data.thoughts.edges}
          refresh={refresh}
          infiniteLoad={infiniteLoad}
        />
      </VStack>
    </Bg>
  );
});
