import React, { useLayoutEffect } from 'react';
import { Box } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { CloseButton } from 'src/components/BackButon';

type Props = RootNavigationScreenProp<'Notifications'>;

export const NotificationsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'お知らせ',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  return <Box flex="1"></Box>;
};
