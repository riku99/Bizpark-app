import React, { useCallback, useState } from "react";
import { Box } from "native-base";
import { useFollowsQuery, UserEdge } from "src/generated/graphql";
import { FollowUserCard } from "src/components/FollowUserCard";
import { RefreshControl } from "src/components/RefreshControl";
import { InfiniteFlatList } from "src/components/InfiniteFlatList";
import { btoa } from "react-native-quick-base64";
import { StyleSheet } from "react-native";
import { Indicator } from "src/components/Indicator";
import { SerachBar } from "src/components/SearchBar";

export const Follows = React.memo(() => {
  const { data, refetch, fetchMore } = useFollowsQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

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

  const renderListHeaderComponent = useCallback(() => {
    return (
      <SerachBar
        onEndEditing={async ({ nativeEvent }) => {
          setIsRefetching(true);
          await refetch({ q: nativeEvent.text });
          setIsRefetching(false);
        }}
      />
    );
  }, []);

  if (!data || isRefetching) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <InfiniteFlatList
        data={data.follows.edges}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.contentContainer}
        infiniteLoad={infiniteLoad}
        ListHeaderComponent={renderListHeaderComponent}
        ListHeaderComponentStyle={styles.listHeader}
      />
    </Box>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
  },
  listHeader: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});
