import { Box } from 'native-base';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ReceiveMessageSwitchItem } from './ReceiveMessageSwitchItem';

type Props = RootNavigationScreenProp<'MessageSettings'>;

export const MessageSettingsScreen = ({ navigation }: Props) => {
  useLayoutEffect(
    function setNavigation() {
      navigation.setOptions({
        title: 'メッセージ',
      });
    },
    [navigation]
  );

  return (
    <Box flex="1">
      <SafeAreaView>
        <ReceiveMessageSwitchItem />
      </SafeAreaView>
    </Box>
  );
};
