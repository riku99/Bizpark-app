import { useTheme } from 'native-base';
import React, { useState } from 'react';
import { Switch } from 'react-native';
import { ListItem } from 'src/components/ListItem';
import {
  useChangeReceiveOneOnOneTalkRoomMessagePushNotificationMutation,
  useGetReceiveOneOnOneTalkRoomMessagePushNotificationQuery,
} from 'src/generated/graphql';

export const OneOnOneMessage = () => {
  const { colors } = useTheme();
  const [changeOneOnOneTalkRoomMessagePushNotificationMutation] =
    useChangeReceiveOneOnOneTalkRoomMessagePushNotificationMutation();
  const { data } = useGetReceiveOneOnOneTalkRoomMessagePushNotificationQuery();
  const [switchValue, setSwitchValue] = useState(
    !!data?.me?.receiveOneOnOneTalkRoomMessagePushNotification
  );

  const onSwitchValueChange = async (value: boolean) => {
    setSwitchValue(value);
    await changeOneOnOneTalkRoomMessagePushNotificationMutation({
      variables: {
        input: {
          value,
        },
      },
      onError: (e) => {
        console.log(e);
        setSwitchValue(!value);
      },
    });
  };

  return (
    <ListItem
      title="個人メッセージ"
      disablePress
      titleStyle={{ fontSize: 16 }}
      ItemRight={
        <Switch
          trackColor={{
            true: colors.pink,
          }}
          value={switchValue}
          onValueChange={onSwitchValueChange}
        />
      }
    />
  );
};
