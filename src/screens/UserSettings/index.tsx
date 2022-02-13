import React, { useLayoutEffect } from 'react';
import { Box } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { ListItem } from 'src/components/ListItem';
import { RightIcon } from 'src/components/RightIcon';

type Props = RootNavigationScreenProp<'UserSettings'>;

export const UserSettingsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'ユーザー',
    });
  }, [navigation]);

  const list = [
    {
      title: 'ブロックしているユーザー',
      onPress: () => {
        navigation.navigate('BlockingUsers');
      },
    },
  ];

  return (
    <Box flex={1}>
      {list.map((item, idx) => (
        <ListItem
          key={idx}
          title={item.title}
          titleStyle={{
            fontSize: '16',
          }}
          onPress={item.onPress}
          ItemRight={<RightIcon />}
        />
      ))}
    </Box>
  );
};
