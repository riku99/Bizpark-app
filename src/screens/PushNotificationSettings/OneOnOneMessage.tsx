import { useTheme } from 'native-base';
import React, { useState } from 'react';
import { Switch } from 'react-native';
import { ListItem } from 'src/components/ListItem';

export const OneOnOneMessage = () => {
  const { colors } = useTheme();

  const [switchValue, setSwitchValue] = useState(true);

  const onSwitchValueChange = (value: boolean) => {};

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
