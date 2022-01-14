import React, { useCallback, useState } from "react";
import { Box, FlatList } from "native-base";
import { useFollowsQuery, UserEdge } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { FollowUserCard } from "src/components/FollowUserCard";
import { RefreshControl } from "src/components/RefreshControl";

export const Follows = React.memo(() => {
  const { data, refetch } = useFollowsQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [contentsHeight, setContentsHeight] = useState(0);

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

  const infiniteLoad = async () => {};

  const renderBottomIndicator = useCallback(() => {
    if (infiniteLoading) {
      return <Indicator style={{ marginTop: 10, height: 45 }} />;
    } else {
      return null;
    }
  }, [infiniteLoading]);

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  const onEndReached = async () => {
    if (contentsHeight && listHeight && contentsHeight > listHeight) {
      setInfiniteLoading(true);
    }
  };

  const onMomentumScrollEnd = async () => {
    if (infiniteLoading) {
      await infiniteLoad();
      setInfiniteLoading(false);
    }
  };

  const onMomentumScrollBegin = () => {
    if (infiniteLoading) {
      setInfiniteLoading(false);
    }
  };

  return (
    <Box flex={1}>
      <FlatList
        data={data.follows.edges}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={renderBottomIndicator}
        onEndReached={onEndReached}
        onLayout={(e) => {
          setListHeight(e.nativeEvent.layout.height);
        }}
        onContentSizeChange={(w, h) => {
          setContentsHeight(h);
        }}
      />
    </Box>
  );
});
