import React, { useCallback } from "react";
import { Box, Text, FlatList, Divider } from "native-base";
import { NewsQuery } from "src/generated/graphql";
import { NewsCard } from "src/components/NewsCard";

type Props = {
  data: NewsQuery;
};

type Item = NewsQuery["news"]["edges"][number];

export const List = React.memo(({ data }: Props) => {
  const renderItem = useCallback(
    ({ item, index }: { item: Item; index: number }) => {
      const { id } = item.node;
      return (
        <>
          <NewsCard id={id} />
          <Box px="4">
            <Divider />
          </Box>
        </>
      );
    },
    []
  );

  return (
    <FlatList
      data={data.news.edges}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(i) => i.node.id}
      contentContainerStyle={{}}
    />
  );
});
