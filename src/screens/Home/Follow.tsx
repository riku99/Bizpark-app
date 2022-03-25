import React from 'react';
import { VStack } from 'native-base';
import { Indicator } from 'src/components/Indicator';
import { List } from '../../components/ThoughtList';
import { Bg } from 'src/components/Bg';
import { useThoughtFeed } from 'src/hooks/thought';
import { StyleSheet } from 'react-native';
import { useNavigateToFirstTabScreen } from './useNavigateToFirstScreen';

export const Follow = React.memo(() => {
  const { listData, refresh, infiniteLoad } = useThoughtFeed({
    follow: true,
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
