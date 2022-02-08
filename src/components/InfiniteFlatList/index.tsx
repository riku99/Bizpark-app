import React, { useCallback, useState } from "react";
import { FlatList, FlatListProps } from "react-native";
import { Indicator } from "src/components/Indicator";
import { useColorModeValue } from "native-base";

type Props<T> = {
  infiniteLoad: () => Promise<void>;
} & FlatListProps<T>;

export const InfiniteFlatList = <T extends {}>({
  infiniteLoad,
  ...props
}: Props<T>) => {
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

  const indicatorStyle = useColorModeValue("black", "white");

  const renderBottomIndicator = useCallback(() => {
    if (isInfiniteLoading) {
      return <Indicator style={{ marginTop: 10, height: 55 }} />;
    } else {
      return null;
    }
  }, [isInfiniteLoading]);

  const onEndReached = useCallback(async () => {
    if (!onEndReachedCalledDuringMomentum && !isInfiniteLoading) {
      console.log("load!");
      setIsInfiniteLoading(true);
      await infiniteLoad();

      setOnEndReachedCalledDuringMomentum(true);

      // ローディングを消すのをフィッチされたデータが反映されるよりも遅くすることで繋がりを自然にする
      setTimeout(() => {
        setIsInfiniteLoading(false);
      }, 200);
    }
  }, [onEndReachedCalledDuringMomentum, isInfiniteLoading]);

  const onMomentumScrollBegin = useCallback(() => {
    setOnEndReachedCalledDuringMomentum(false);
  }, []);

  return (
    <FlatList
      onEndReachedThreshold={0.3}
      onEndReached={onEndReached}
      ListFooterComponent={renderBottomIndicator}
      onMomentumScrollBegin={onMomentumScrollBegin}
      indicatorStyle={indicatorStyle}
      {...props}
    />
  );
};
