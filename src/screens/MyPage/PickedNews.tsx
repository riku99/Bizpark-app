import React, { useCallback, useState } from 'react';
import { Box } from 'native-base';
import {
  useGetPickedNewsQuery,
  GetPickedNewsQuery,
} from 'src/generated/graphql';
import { btoa } from 'react-native-quick-base64';
import { Indicator } from 'src/components/Indicator';
import { InfiniteFlatList } from 'src/components/InfiniteFlatList';
import { NewsCard } from 'src/components/NewsCard';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';
import { RefreshControl } from 'src/components/RefreshControl';
import { useMyId } from 'src/hooks/me';

type Item = GetPickedNewsQuery['user']['pickedNews']['edges'][number];

export const PickedNews = () => {
  const myId = useMyId();

  const { data, refetch, fetchMore } = useGetPickedNewsQuery({
    variables: {
      userId: myId,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const infiniteLoad = async () => {
    const { pageInfo } = data.user.pickedNews;
    if (pageInfo.hasNextPage) {
      const { endCursor } = pageInfo;

      await fetchMore({
        variables: {
          cursor: endCursor ? btoa(endCursor) : undefined,
        },
      });
    }
  };

  const renderItem = useCallback(({ item }: { item: Item }) => {
    const { id } = item.node.news;

    const onPress = () => {
      navigation.navigate('NewsWebView', { id });
    };
    return <NewsCard id={id} onPress={onPress} divider />;
  }, []);

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <InfiniteFlatList
        data={data.user.pickedNews.edges}
        renderItem={renderItem}
        infiniteLoad={infiniteLoad}
        initialNumToRender={10}
        keyExtractor={(item) => item.node.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Box>
  );
};
