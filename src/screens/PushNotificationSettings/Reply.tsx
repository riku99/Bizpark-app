import { useTheme } from 'native-base';
import React, { useState } from 'react';
import { Switch } from 'react-native';
import { ListItem } from 'src/components/ListItem';
import {
  useChangeReceiveReplyPushNotificationMutation,
  useGetReceiveReplyPushNotificationQuery,
} from 'src/generated/graphql';

export const Reply = () => {
  const { colors } = useTheme();
  const { data } = useGetReceiveReplyPushNotificationQuery();
  const [switchValue, setSwitchValue] = useState(
    !!data?.me.receiveReplyPushNotification
  );
  const [changeReplyPushNotificationMutation] =
    useChangeReceiveReplyPushNotificationMutation();

  const onSwitchValueChange = async (value: boolean) => {
    setSwitchValue(value);
    await changeReplyPushNotificationMutation({
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
      title="返信"
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
