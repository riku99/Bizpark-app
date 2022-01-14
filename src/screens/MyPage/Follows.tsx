import React, { useCallback } from "react";
import { Box, FlatList } from "native-base";
import { useFollowsQuery, UserEdge } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { FollowUserCard } from "src/components/FollowUserCard";

export const Follows = React.memo(() => {
  const { data } = useFollowsQuery();

  const renderItem = useCallback(
    ({ item }: { item: UserEdge }) => {
      return <FollowUserCard id={item.node.id} />;
    },
    [data]
  );

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={data.follows.edges}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id}
      />
    </Box>
  );
});
