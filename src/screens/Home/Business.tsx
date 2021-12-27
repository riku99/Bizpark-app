import React from "react";
import { Box, VStack } from "native-base";
import { Bg } from "src/components/Bg";
import { useThoughtsQuery, Genre, Thought } from "src/generated/graphql";
import { List } from "./List";

export const Business = React.memo(() => {
  const [result, reexecuteQuery] = useThoughtsQuery({
    variables: { genre: Genre.Business },
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
