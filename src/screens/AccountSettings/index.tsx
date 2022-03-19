import React, { useLayoutEffect, useState } from 'react';
import { Box } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { ListItem } from 'src/components/ListItem';
import { RightIcon } from 'src/components/RightIcon';
import { Alert } from 'react-native';
import { useSignOut } from 'src/hooks/auth';
import { useLoggedIn } from 'src/hooks/me';
import { useDeleteAccountMutation } from 'src/generated/graphql';
import { useApolloClient } from '@apollo/client';
import Spinner from 'react-native-loading-spinner-overlay';

type Props = RootNavigationScreenProp<'AccountSettings'>;

export const AccountSettingsScreen = ({ navigation }: Props) => {
  const { setLoggedIn } = useLoggedIn();
  const [deleteAccountMutation] = useDeleteAccountMutation();
  const client = useApolloClient();
  const { signOut } = useSignOut();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'アカウント',
    });
  }, [navigation]);

  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const list = [
    {
      title: 'ログアウト',
      onPress: () => {
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
    {
      title: 'アカウント削除',
      titleStyle: { 
        color: 'red',
      },
      onPress: () => {
        Alert.alert(
          'アカウントを削除してよろしいですか?',
          'サブスクリプションに加入している場合はお使いの端末から解約してください。削除されたデータなどを元に戻すことはできません。',
          [
            {
              text: 'キャンセル',
              style: 'cancel',
            },
            {
              text: '削除',
              style: 'destructive',
              onPress: async () => {
                try {
                  setSpinnerVisible(true);
                  await deleteAccountMutation();
                  await client.clearStore();
                  setLoggedIn(false);
                } catch (e) {
                  console.log(e);
                } finally {
                  setSpinnerVisible(false);
                }
              },
            },
          ]
        );
      },
    },
  ];

  return (
    <Box flex={1}>
      {list.map((l, idx) => (
        <ListItem
          key={idx}
          title={l.title}
          onPress={l.onPress}
          ItemRight={l.rightIcon ? <RightIcon /> : undefined}
          titleStyle={{
            fontSize: 16,
            ...l.titleStyle,
          }}
        />
      ))}
      <Spinner visible={spinnerVisible} overlayColor="rgba(0,0,0,0.5)" />
    </Box>
  );
};
