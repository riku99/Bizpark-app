import auth from '@react-native-firebase/auth';
import { Box, Button, HStack, Input, Pressable, Text } from 'native-base';
import React, { useLayoutEffect, useState } from 'react';
import { Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { CloseButton } from 'src/components/BackButon';
import {
  useSendEmailAuthCodeMutation,
  useUpdateEmailMutation,
  useVerifyEmailAuthCodeMutation,
} from 'src/generated/graphql';
import { handleVerifyEmailAuthCodeMutationError } from 'src/helpers/handleVerifyEmailAuthCodeMutationError';

type Props = RootNavigationScreenProp<'EmaiChangeVerification'>;

export const EmailChangeVerificationScreen = ({ navigation, route }: Props) => {
  const { email } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'メール認証',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const [emailAuthCodeId, setEmailAuthCodeId] = useState(
    route.params.emailAuthCodeId
  );
  const [code, setCode] = useState('');
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [verifyEmailAuthCodeMutation] = useVerifyEmailAuthCodeMutation();
  const [updateEmailMutation] = useUpdateEmailMutation();
  const [sendEmailMutation] = useSendEmailAuthCodeMutation();

  const firebaseUser = auth().currentUser;
  const currentEmail = firebaseUser ? firebaseUser.email : null;

  const onSubmit = async () => {
    setSpinnerVisible(true);
    try {
      if (!firebaseUser) {
        Alert.alert(
          '更新に失敗しました',
          '一度ログアウトした後にやり直してください。'
        );
        return;
      }

      try {
        await verifyEmailAuthCodeMutation({
          variables: {
            id: emailAuthCodeId,
            input: {
              code,
              email,
            },
          },
        });

        try {
          await updateEmailMutation({
            variables: {
              input: {
                email,
              },
            },
          });

          try {
            await firebaseUser.updateEmail(email);
            Alert.alert('更新しました', '', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.popToTop();
                },
              },
            ]);
          } catch (e) {
            await updateEmailMutation({
              variables: {
                input: {
                  email: currentEmail,
                },
              },
            });
          }
        } catch (e) {
          Alert.alert('更新に失敗しました');
          return;
        }
      } catch (e) {
        handleVerifyEmailAuthCodeMutationError(e);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSpinnerVisible(false);
    }
  };

  const onResendPress = async () => {
    setSpinnerVisible(true);
    try {
      const { data: resendData } = await sendEmailMutation({
        variables: {
          input: {
            email,
          },
        },
      });

      setEmailAuthCodeId(resendData.createEmailAuthCode);
      Alert.alert('再送信しました', '最新の認証コードをお使いください');
    } catch (e) {
      Alert.alert('再送信に失敗しました');
    } finally {
      setSpinnerVisible(false);
    }
  };

  return (
    <Box px="4">
      <Text mt="2">{email}に送信された認証番号を入力してください。</Text>

      <Input
        placeholder="認証コード"
        borderWidth="1"
        borderColor="lightGray"
        mt="8"
        w="40%"
        selectionColor="pink"
        _focus={{
          borderColor: 'pink',
        }}
        keyboardType="number-pad"
        onChangeText={setCode}
      />

      <Button mt="8" onPress={onSubmit}>
        認証する
      </Button>

      <HStack mt="8">
        <Text>メールが届きませんか?</Text>
        <Pressable onPress={onResendPress}>
          <Text ml="2" textDecorationLine="underline">
            再送信する
          </Text>
        </Pressable>
      </HStack>

      <Spinner visible={spinnerVisible} overlayColor="rgba(0,0,0,0.5)" />
    </Box>
  );
};
