import React from 'react';
import { Box } from 'native-base';
import { useUserThoughtsQuery } from 'src/generated/graphql';
import { List } from 'src/components/ThoughtList';
import { Indicator } from 'src/components/Indicator';
import { meVar } from 'src/stores/me';
import { btoa } from 'react-native-quick-base64';

export const Thouhgts = React.memo(() => {
  const myId = meVar.id();

  const { data, refetch, fetchMore } = useUserThoughtsQuery({
    variables: {
      userId: myId,
    },
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

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1} px="4" pt="4">
      <List
        data={data.userThoughts.edges}
        refresh={refresh}
        infiniteLoad={infiniteLoad}
      />
    </Box>
  );
});
