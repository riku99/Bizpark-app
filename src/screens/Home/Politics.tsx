import React from 'react';
import { VStack } from 'native-base';
import { Bg } from 'src/components/Bg';
import { Genre } from 'src/generated/graphql';
import { List } from '../../components/ThoughtList';
import { Indicator } from 'src/components/Indicator';
import { useThoughtFeed } from 'src/hooks/thought';
import { StyleSheet } from 'react-native';
import { useNavigateToFirstTabScreen } from './useNavigateToFirstScreen';

export const Politics = React.memo(() => {
  const { listData, refresh, infiniteLoad } = useThoughtFeed({
    genre: Genre.Politics,
  });

  useNavigateToFirstTabScreen();

  if (!listData) {
    return <Indicator style={styles.indicator} />;
  }

  return (
    <Bg flex={1} pt={4} w="100%" h="100%">
      <VStack px={4}>
        <List data={listData} refresh={refresh} infiniteLoad={infiniteLoad} />
      </VStack>
    </Bg>
  );
});

const styles = StyleSheet.create({
  indicator: {
    marginTop: 10,
  },
});
