import React, { useState, useRef } from "react";
import { FlatList, FlatListProps } from "react-native";
import { Indicator } from "src/components/Indicator";

type Props<T> = {
  infiniteLoad: () => Promise<void>;
} & FlatListProps<T>;

export const InfiniteFlatList = <T extends {}>({
  infiniteLoad,
  ...props
}: Props<T>) => {
  const [listHeight, setListHeight] = useState(0);
  const [contentsHeight, setContentsHeight] = useState(0);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

  const listRef = useRef<FlatList>(null);

  const renderBottomIndicator = () => {
    if (isInfiniteLoading) {
      return <Indicator style={{ marginTop: 10, height: 55 }} />;
    } else {
      return null;
    }
  };

  const onEndReached = async () => {
    // コンテンツのサイズがリストよりも大きい場合のみ実行。これないとアイテム数が少なくて画面サイズ超えていない時にも実行されてしまう
    if (
      contentsHeight &&
      listHeight &&
      contentsHeight > listHeight &&
      !onEndReachedCalledDuringMomentum &&
      !isInfiniteLoading
    ) {
      setIsInfiniteLoading(true);
      await infiniteLoad();

      setOnEndReachedCalledDuringMomentum(true);

      // ローディングを消すのをフィッチされたデータが反映されるよりも遅くすることで繋がりを自然にする
      setTimeout(() => {
        setIsInfiniteLoading(false);
      }, 300);
    }
  };

  const onMomentumScrollBegin = () => {
    setOnEndReachedCalledDuringMomentum(false);
  };

  return (
    <FlatList
      ref={listRef}
      onEndReachedThreshold={0.3}
      onEndReached={onEndReached}
      ListFooterComponent={renderBottomIndicator}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onLayout={(e) => {
        setListHeight(e.nativeEvent.layout.height);
      }}
      onContentSizeChange={(w, h) => {
        setContentsHeight(h);
      }}
      indicatorStyle="white"
      {...props}
    />
  );
};
