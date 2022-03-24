import React, { useLayoutEffect } from 'react';
import { Box } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';

type Props = RootNavigationScreenProp<'TabOrderChange'>;

export const TabOrderChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '順番の並び替え',
    });
  }, [navigation]);

  return <Box></Box>;
};
