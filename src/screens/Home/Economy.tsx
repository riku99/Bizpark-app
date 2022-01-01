import React from "react";
import { VStack } from "native-base";
import { Bg } from "src/components/Bg";
import { useThoughtsQuery, Genre } from "src/generated/graphql";
import { List } from "./List";
import { Indicator } from "src/components/Indicator";

export const Economy = React.memo(() => {
  const { data, refetch } = useThoughtsQuery({
    variables: { genre: Genre.Economy },
  });

  const refresh = async () => {
    await refetch();
  };

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Bg flex={1} pt={4} w="100%" h="100%">
      <VStack px={4}>
        <List data={data} refresh={refresh} />
      </VStack>
    </Bg>
  );
});
