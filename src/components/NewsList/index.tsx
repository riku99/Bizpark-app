import { useNavigation } from '@react-navigation/native';
import { Box, Divider, useColorModeValue, useTheme } from 'native-base';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Indicator } from 'src/components/Indicator';
import { NewsCard } from 'src/components/NewsCard';
import { NewsEdge, NewsQuery } from 'src/generated/graphql';
import { RootNavigationProp } from 'src/types';

type Props = {
  data: NewsEdge[];
  refresh: () => Promise<void>;
  infiniteLoad: () => Promise<void>;
};

type Item = NewsQuery['news']['edges'][number];

export const List = React.memo(({ data, refresh, infiniteLoad }: Props) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [contentsHeight, setContentsHeight] = useState(0);
  const [listHeight, setListHeight] = useState(0);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const renderBottomIndicator = () => {
    if (infiniteLoading) {
      return <Indicator style={{ marginTop: 10, height: 45 }} />;
    } else {
      return null;
    }
  };

  const onEndReached = () => {
    if (
      !infiniteLoading &&
      contentsHeight &&
      listHeight &&
      contentsHeight > listHeight
    ) {
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

  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const renderItem = useCallback(
    ({ item, index }: { item: Item; index: number }) => {
      const { id } = item.node;
      const onPress = () => {
        navigation.navigate('NewsWebView', { id });
      };

      return (
        <>
          <NewsCard id={id} onPress={onPress} />
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
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(i) => i.node.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={useColorModeValue(undefined, colors.lightGray)}
          onRefresh={onRefresh}
        />
      }
      ListFooterComponent={renderBottomIndicator}
      onEndReachedThreshold={0.3}
      onEndReached={onEndReached}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onLayout={(e) => {
        setListHeight(e.nativeEvent.layout.height);
      }}
      onContentSizeChange={(_, h) => {
        setContentsHeight(h);
      }}
    />
  );
});
