import { useTheme } from 'native-base';
import React, { useState } from 'react';
import { Switch } from 'react-native';
import { ListItem } from 'src/components/ListItem';
import { useChangeReceiveOneOnOneTalkRoomMessageMutation } from 'src/generated/graphql';
import { useReceiveOneOnOneTalkRoomMessage } from 'src/hooks/me';

export const ReceiveMessageSwitchItem = () => {
  const { colors } = useTheme();
  const receiveMessge = useReceiveOneOnOneTalkRoomMessage();
  const [switchValue, setSwitchValue] = useState(!!receiveMessge);
  const [changeReceiveMessageMutation] =
    useChangeReceiveOneOnOneTalkRoomMessageMutation();

  const onSwitchValueChange = async (value: boolean) => {
    setSwitchValue(value);

    await changeReceiveMessageMutation({
      variables: {
        input: {
          value,
        },
      },
      onError: () => {
        setSwitchValue(!value);
      },
    });
  };

  return (
    <ListItem
      title="個人メッセージを受け取る"
      titleStyle={{
        fontSize: 16,
      }}
      ItemRight={
        <Switch
          value={switchValue}
          trackColor={{
            true: colors.pink,
          }}
          onValueChange={onSwitchValueChange}
        />
      }
    />
  );
};
