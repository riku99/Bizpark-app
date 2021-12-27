import React from "react";
import { VStack } from "native-base";
import { Bg } from "src/components/Bg";
import { useThoughtsQuery, Genre } from "src/generated/graphql";
import { List } from "./List";

export const Economy = React.memo(() => {
  const [result, reexecuteQuery] = useThoughtsQuery({
    variables: { genre: Genre.Economy },
  });
  const { data } = result;

  if (!data) {
    return null;
  }

  return (
    <Bg flex={1} pt={4} w="100%" h="100%">
      <VStack px={4}>
        <List data={data.thoughts} />
      </VStack>
    </Bg>
  );
});
