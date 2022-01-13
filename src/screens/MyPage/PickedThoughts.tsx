import React from "react";
import { Box } from "native-base";
import { usePickedThoughtsQuery } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { List } from "src/components/ThoughtList";
import { btoa } from "react-native-quick-base64";

export const PickedThoughts = React.memo(() => {
  const { data, refetch, fetchMore } = usePickedThoughtsQuery();

  const refresh = async () => {
    await refetch();
  };

  const infiniteLoad = async () => {
    const { pageInfo } = data.pickedThoughts;
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
    <Box flex={1} pt={4} w="100%" h="100%">
      <List
        data={data.pickedThoughts.edges}
        refresh={refresh}
        infiniteLoad={infiniteLoad}
      />
    </Box>
  );
});
