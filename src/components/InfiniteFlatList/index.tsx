import React, { useCallback, useState, ComponentProps } from "react";
import { FlatList, RefreshControl, FlatListProps } from "react-native";
import { Indicator } from "src/components/Indicator";

type Props<T> = { infiniteLoad: () => Promise<void> } & FlatListProps<T>;

export const InfiniteFlatList = <T extends {}>({
  infiniteLoad,
  ...props
}: Props<T>) => {
  const [listHeight, setListHeight] = useState(0);
  const [contentsHeight, setContentsHeight] = useState(0);
  const [infiniteLoading, setInfiniteLoading] = useState(false);

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
      {...props}
    />
  );
};
