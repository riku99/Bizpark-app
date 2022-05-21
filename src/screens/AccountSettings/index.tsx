import { useApolloClient } from '@apollo/client';
import auth from '@react-native-firebase/auth';
import * as InAppPurchases from 'expo-in-app-purchases';
import { Box, ScrollView, Text, useColorModeValue, VStack } from 'native-base';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { CloseButton } from 'src/components/BackButon';
import { ListItem } from 'src/components/ListItem';
import { RightIcon } from 'src/components/RightIcon';
import { loginProviders } from 'src/constants';
import {
  useDeleteAccountMutation,
  useVerifyIapReceiptMutation,
} from 'src/generated/graphql';
import { getLoginProvider } from 'src/helpers/getLoginProvider';
import { sendPasswordResetEmail } from 'src/helpers/sendPasswordResetEmail';
import { useSignOut } from 'src/hooks/auth';
import { useLoggedIn } from 'src/hooks/me';
import { RootNavigationScreenProp } from 'src/types';

type Props = RootNavigationScreenProp<'AccountSettings'>;

export const AccountSettingsScreen = ({ navigation }: Props) => {
  const { setLoggedIn } = useLoggedIn();
  const [deleteAccountMutation] = useDeleteAccountMutation();
  const [verifyReceiptMutation] = useVerifyIapReceiptMutation();
  const client = useApolloClient();
  const { signOut } = useSignOut();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'アカウント',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const list = [
    {
      title: '購入内容の復元',
      onPress: async () => {
        setSpinnerVisible(true);
        const { results } = await InAppPurchases.getPurchaseHistoryAsync();
        if (!results.length) {
          setSpinnerVisible(false);
          Alert.alert('', '購入内容が存在しません');
          return;
        }
        const latestResult = results[0];
        console.log(latestResult);
        await verifyReceiptMutation({
          variables: {
            input: {
              receipt: latestResult.transactionReceipt,
              platform: Platform.OS,
              productId: latestResult.productId,
            },
          },
          onCompleted: () => {
            console.log('検証完了');
          },
          onError: (e) => {
            console.log(e);
            console.log('検証失敗');
          },
        });
        await InAppPurchases.finishTransactionAsync(latestResult, false);
        setSpinnerVisible(false);
        Alert.alert('', '購入内容を復元しました');
      },
    },
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

  const textGray = useColorModeValue('lt.textGray', 'dt.textGray');

  const user = auth().currentUser;
  const email = user ? user.email : '';
  const provider = getLoginProvider() ?? '不明';

  const onEmailChangePress = () => {
    if (provider !== loginProviders.mailAddress) {
      return;
    }

    navigation.navigate('EmailChange');
  };

  const onPasswordChangePress = () => {
    sendPasswordResetEmail(email);
  };

  return (
    <ScrollView flex={1}>
      {/* 基本情報 */}
      <Box mt="1">
        <Text fontWeight="bold" color={textGray} fontSize="13" pl="4">
          基本情報
        </Text>

        <VStack mt="2">
          <ListItem
            title={
              provider === loginProviders.mailAddress
                ? 'メールアドレスを変更'
                : '登録中のメールアドレス'
            }
            titleStyle={styles.basicStatusItemTitle}
            ItemRight={<Text>{email}</Text>}
            onPress={onEmailChangePress}
          />
          {provider === loginProviders.mailAddress && (
            <ListItem
              title="パスワードを変更"
              titleStyle={styles.basicStatusItemTitle}
              onPress={onPasswordChangePress}
            />
          )}
          <ListItem
            title="ログイン方法"
            titleStyle={styles.basicStatusItemTitle}
            ItemRight={<Text>{provider}</Text>}
            disablePress
          />
        </VStack>
      </Box>

      <Box mt="4">
        {list.map((l, idx) => (
          <ListItem
            key={idx}
            title={l.title}
            onPress={l.onPress}
            ItemRight={l.rightIcon ? <RightIcon /> : undefined}
            titleStyle={{
              ...styles.itemTitleStyle,
              ...l.titleStyle,
            }}
          />
        ))}
      </Box>
      <Spinner visible={spinnerVisible} overlayColor="rgba(0,0,0,0.5)" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  basicStatusItemTitle: {
    fontSize: 14,
  },
  itemTitleStyle: {
    fontSize: 16,
  },
});
