import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ThoughtsQuery, ThoughtEdge } from "src/generated/graphql";
import { ThoughtCard } from "src/components/ThoughtCard";
import { useColorModeValue, useTheme } from "native-base";
import { Indicator } from "src/components/Indicator";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";

type Data = ThoughtEdge[];

type Props = {
  data: Data;
  refresh: () => Promise<void>;
  infiniteLoad: () => Promise<void>;
};

export const List = ({ data, refresh, infiniteLoad }: Props) => {
  const { colors } = useTheme();
  const [listHeight, setListHeight] = useState(0);
  const [contentsHeight, setContentsHeight] = useState(0);
  const navigation = useNavigation<RootNavigationProp<"Tab">>();
  const [refreshing, setRefreshing] = useState(false);
  const [infiniteLoading, setInfiniteLoading] = useState(false);

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: ThoughtsQuery["thoughts"]["edges"][number];
      index: number;
    }) => {
      const { id } = item.node;

      return (
        <ThoughtCard
          id={id}
          mt={index !== 0 ? 4 : 0}
          onPress={() => {
            navigation.navigate("Thought", {
              id,
            });
          }}
        />
      );
    },
    []
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const renderBottomIndicator = useCallback(() => {
    if (infiniteLoading) {
      return <Indicator style={{ marginTop: 10, height: 45 }} />;
    } else {
      return null;
    }
  }, [infiniteLoading]);

  // スクロールしていなくても、最後の位置にいる場合は無限に実行される
  const onEndReached = async () => {
    // コンテンツのサイズがリストよりも大きい場合のみ実行
    // これないとアイテム数が少なくて画面サイズ超えていない時にも実行されてしまう
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

  // リストの最後まで行く -> フェッチする -> 上部にスクロールすると onMomentumScrollEndが再度実行されてしまう
  // なので「上部にスクロールした瞬間」にfalseにして実行されないようにする
  const onMomentumScrollBegin = () => {
    if (infiniteLoading) {
      setInfiniteLoading(false);
    }
  };

  return (
    <FlatList
      data={data}
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
      onLayout={(e) => {
        setListHeight(e.nativeEvent.layout.height);
      }}
      onContentSizeChange={(w, h) => {
        setContentsHeight(h);
      }}
    />
  );
};
