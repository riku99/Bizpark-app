import React from "react";
import { VStack } from "native-base";
import { Bg } from "src/components/Bg";
import { useThoughtsQuery, Genre } from "src/generated/graphql";
import { List } from "./List";
import { Indicator } from "src/components/Indicator";
import { btoa } from "react-native-quick-base64";

export const Business = React.memo(() => {
  const { data, refetch, fetchMore } = useThoughtsQuery({
    variables: { genre: Genre.Business },
  });

  const refresh = async () => {
    await refetch();
  };

  const infiniteLoad = async () => {
    if (data.thoughts.pageInfo.hasNextPage) {
      const cursor = data.thoughts.pageInfo.endCursor;
      await fetchMore({
        variables: {
          genre: Genre.Business,
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
        <List data={data} refresh={refresh} infiniteLoad={infiniteLoad} />
      </VStack>
    </Bg>
  );
});
