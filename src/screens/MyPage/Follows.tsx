import React, { useCallback, useState } from "react";
import { Box } from "native-base";
import { useFollowsQuery, UserEdge } from "src/generated/graphql";
import { FollowUserCard } from "src/components/FollowUserCard";
import { RefreshControl } from "src/components/RefreshControl";
import { InfiniteFlatList } from "src/components/InfiniteFlatList";
import { btoa } from "react-native-quick-base64";

export const Follows = React.memo(() => {
  const { data, refetch, fetchMore } = useFollowsQuery();
  const [refreshing, setRefreshing] = useState(false);

  const renderItem = useCallback(
    ({ item }: { item: UserEdge }) => {
      return <FollowUserCard id={item.node.id} />;
    },
    [data]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const infiniteLoad = async () => {
    if (data.follows.pageInfo.hasNextPage) {
      const cursor = data.follows.pageInfo.endCursor;
      await fetchMore({
        variables: {
          cursor: cursor ? btoa(cursor) : undefined,
        },
      });
    }
  };

  return (
    <Box flex={1}>
      <InfiniteFlatList
        data={data.follows.edges}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        infiniteLoad={infiniteLoad}
      />
    </Box>
  );
});
