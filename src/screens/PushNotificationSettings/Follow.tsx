import { useTheme } from 'native-base';
import React, { useState } from 'react';
import { Switch } from 'react-native';
import { ListItem } from 'src/components/ListItem';
import {
  useChangeReceiveFollowPushNotificationMutation,
  useGetReceiveFollowPushNotificationQuery,
} from 'src/generated/graphql';

export const Follow = () => {
  const { colors } = useTheme();
  const { data } = useGetReceiveFollowPushNotificationQuery();
  const [switchValue, setSwitchValue] = useState(
    !!data?.me?.receiveFollowPushNotification
  );
  const [changeReceiveFollowPushNotificationMutation] =
    useChangeReceiveFollowPushNotificationMutation();

  const onSwitchValueChange = async (value: boolean) => {
    setSwitchValue(value);
    await changeReceiveFollowPushNotificationMutation({
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
      title="フォロー"
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
