import React, { useLayoutEffect, useCallback } from 'react';
import { Box } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { CloseButton } from 'src/components/BackButon';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

type Props = RootNavigationScreenProp<'NewsTabOrderChange'>;

export const NewsTabOrderChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '順番の並び替え',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const renderItem = useCallback(() => {}, []);

  return <Box flex="1"></Box>;
};
