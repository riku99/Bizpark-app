import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ThoughtsQuery } from "src/generated/graphql";
import { ThoughtCard } from "src/components/ThoughtCard";
import { useColorModeValue, useTheme } from "native-base";
import { Indicator } from "src/components/Indicator";

type Props = {
  data: ThoughtsQuery;
  refresh: () => Promise<void>;
  infiniteLoad: () => Promise<void>;
};

export const List = ({ data, refresh, infiniteLoad }: Props) => {
  const { colors } = useTheme();

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: ThoughtsQuery["thoughts"]["edges"][number];
      index: number;
    }) => {
      const { picked, id, title, text, contributor } = item.node;

      return (
        <ThoughtCard
          id={id}
          title={title}
          text={text}
          contributor={{
            name: contributor.name,
            imageUrl: contributor.imageUrl,
          }}
          picked={!!picked.length}
          mt={index !== 0 ? 4 : 0}
        />
      );
    },
    []
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const [infiniteLoading, setInfiniteLoading] = useState(false);

  const renderBottomIndicator = useCallback(() => {
    if (infiniteLoading) {
      return <Indicator style={{ marginTop: 10 }} />;
    } else {
      return null;
    }
  }, [infiniteLoading]);

  const onEndReached = async () => {
    setInfiniteLoading(true);
  };

  const onMomentumScrollEnd = async () => {
    if (infiniteLoading) {
      console.log("load!");
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
    <FlatList
      data={data.thoughts.edges}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8, minHeight: "100%" }}
      keyExtractor={(i) => i.node.id}
      refreshControl={
        <RefreshControl
          tintColor={useColorModeValue(undefined, colors.lightGray)}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      onEndReachedThreshold={0.3}
      onEndReached={onEndReached}
      ListFooterComponent={renderBottomIndicator}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onMomentumScrollBegin={onMomentumScrollBegin}
    />
  );
};
