import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ThoughtsQuery } from "src/generated/graphql";
import { ThoughtCard } from "src/components/ThoughtCard";
import { useColorModeValue, useTheme } from "native-base";

type QueryItemData = ThoughtsQuery["thoughts"][number];
type Props = { data: QueryItemData[]; refresh: () => Promise<void> };

export const List = ({ data, refresh }: Props) => {
  const { colors } = useTheme();

  const renderItem = useCallback(
    ({ item, index }: { item: QueryItemData; index: number }) => {
      const picked = item.picked.length;
      return (
        <ThoughtCard
          id={item.id}
          title={item.title}
          text={item.text}
          contributor={{
            name: item.contributor.name,
            imageUrl: item.contributor.imageUrl,
          }}
          picked={!!picked}
          key={item.id}
          mt={index !== 0 ? 4 : 0}
        />
      );
    },
    []
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    // await refresh();
    // setRefreshing(false);
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8, height: "100%" }}
      refreshControl={
        <RefreshControl
          tintColor={useColorModeValue(undefined, colors.lightGray)}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};
