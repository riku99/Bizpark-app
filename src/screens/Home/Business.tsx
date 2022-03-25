import React from 'react';
import { VStack } from 'native-base';
import { Bg } from 'src/components/Bg';
import { Genre } from 'src/generated/graphql';
import { List } from '../../components/ThoughtList';
import { Indicator } from 'src/components/Indicator';
import { StyleSheet } from 'react-native';
import { useThoughtFeed } from 'src/hooks/thought';
import { TopTabScreenProp } from './types';
import { useNavigateToFirstTabScreen } from './useNavigateToFirstScreen';

type Props = TopTabScreenProp<'Business'>;

export const Business = React.memo(({ navigation }: Props) => {
  const { listData, refresh, infiniteLoad } = useThoughtFeed({
    genre: Genre.Business,
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
