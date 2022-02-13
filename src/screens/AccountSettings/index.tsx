import React, { useLayoutEffect } from 'react';
import { Box } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { ListItem } from 'src/components/ListItem';
import { RightIcon } from 'src/components/RightIcon';
import { Alert } from 'react-native';
import { useSignOut } from 'src/hooks/auth';

type Props = RootNavigationScreenProp<'AccountSettings'>;

export const AccountSettingsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'アカウント',
    });
  }, [navigation]);

  const { signOut } = useSignOut();

  const list = [
    {
      title: 'ログアウト',
      onPress: async () => {
        Alert.alert('ログアウト', 'ログアウトしてよろしいですか?', [
          {
            text: 'キャンセル',
            style: 'cancel',
          },
          {
            text: 'ログアウト',
            style: 'destructive',
            onPress: async () => {
              await signOut();
            },
          },
        ]);
      },
      rightIcon: false,
    },
  ];

  return (
    <Box flex={1}>
      {list.map((l, idx) => (
        <ListItem
          key={idx}
          title={l.title}
          titleStyle={{
            fontSize: 16,
          }}
          onPress={l.onPress}
          ItemRight={l.rightIcon ? <RightIcon /> : undefined}
        />
      ))}
    </Box>
  );
};
