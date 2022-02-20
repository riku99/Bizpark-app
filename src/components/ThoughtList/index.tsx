import React, { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';
import { ThoughtEdge, Thought } from 'src/generated/graphql';
import { ThoughtCard } from 'src/components/ThoughtCard';
import { useColorModeValue, useTheme } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';
import { InfiniteFlatList } from 'src/components/InfiniteFlatList';

type Props = {
  data: Thought[];
  refresh: () => Promise<void>;
  infiniteLoad: () => Promise<void>;
};

export const List = ({ data, refresh, infiniteLoad }: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation<RootNavigationProp<'Tab'>>();
  const [refreshing, setRefreshing] = useState(false);

  const renderItem = useCallback(
    ({ item, index }: { item: Thought; index: number }) => {
      const { id } = item;

      return (
        <ThoughtCard
          id={id}
          mt={index !== 0 ? 4 : 0}
          onPress={() => {
            navigation.navigate('Thought', {
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

  return (
    <InfiniteFlatList<Thought>
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8, minHeight: '100%' }}
      keyExtractor={(i: Thought) => i.id}
      refreshControl={
        <RefreshControl
          tintColor={useColorModeValue(undefined, colors.lightGray)}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      infiniteLoad={infiniteLoad}
    />
  );
};
