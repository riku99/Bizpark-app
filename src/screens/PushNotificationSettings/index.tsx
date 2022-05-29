import { Box } from 'native-base';
import React, { useLayoutEffect } from 'react';
import { Follow } from './Follow';
import { OneOnOneMessage } from './OneOnOneMessage';
import { Reply } from './Reply';

type Props = RootNavigationScreenProp<'PushNotificationSettings'>;

export const PushNotificationSettingsScreen = ({ navigation }: Props) => {
  useLayoutEffect(function setNavigation() {
    navigation.setOptions({
      title: 'プッシュ通知',
    });
  });

  return (
    <Box flex="1">
      <Reply />
      <OneOnOneMessage />
      <Follow />
    </Box>
  );
};
