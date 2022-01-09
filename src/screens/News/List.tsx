import React, { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import {
  Box,
  Text,
  FlatList,
  Divider,
  useTheme,
  useColorModeValue,
} from "native-base";
import { NewsQuery } from "src/generated/graphql";
import { NewsCard } from "src/components/NewsCard";

type Props = {
  data: NewsQuery;
  refresh: () => Promise<void>;
  infiniteLoad: () => Promise<void>;
};

type Item = NewsQuery["news"]["edges"][number];

export const List = React.memo(({ data, refresh, infiniteLoad }: Props) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={useColorModeValue(undefined, colors.lightGray)}
          onRefresh={onRefresh}
        />
      }
    />
  );
});
