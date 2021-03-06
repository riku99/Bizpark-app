import auth from '@react-native-firebase/auth';
import { Box, Button, Input, Text } from 'native-base';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Keyboard, SafeAreaView, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseButton } from 'src/components/BackButon';
import {
  useSendEmailAuthCodeMutation,
  useUpdateEmailMutation,
} from 'src/generated/graphql';

const AnimatedButton = Animated.createAnimatedComponent(Button);

type Props = RootNavigationScreenProp<'EmailChange'>;

export const EmailChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'メールアドレスを変更',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const [updateEmailMutation] = useUpdateEmailMutation();
  const [sendEmailMutation] = useSendEmailAuthCodeMutation();
  const [newEmail, setNewEmail] = useState('');
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const buttonBottom = useSharedValue(0);
  const buttonContainerStyle = useAnimatedStyle(() => {
    return {
      bottom: buttonBottom.value,
    };
  });

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardWillShow', (e) => {
      buttonBottom.value = withTiming(
        e.endCoordinates.height - safeAreaBottom + BUTTON_BOTTOM,
        {
          duration: e.duration,
        }
      );
    });

    return () => {
      subscription.remove();
    };
  }, [buttonBottom, safeAreaBottom]);

  const firebaseUser = auth().currentUser;
  if (!firebaseUser) {
    Alert.alert('エラーが発生しました', '', [
      {
        text: 'OK',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  }

  if (!firebaseUser) {
    return null;
  }

  const email = firebaseUser.email;

  const updateEmail = async () => {
    setSpinnerVisible(true);
    await updateEmailMutation({
      variables: {
        input: {
          email: newEmail,
        },
      },
      onCompleted: async () => {
        try {
          await firebaseUser.updateEmail(newEmail);
          setSpinnerVisible(false);
          Alert.alert('更新しました');
          return;
        } catch (e) {
          console.log(e);

          await updateEmailMutation({
            variables: {
              input: {
                email,
              },
            },
          });

          setSpinnerVisible(false);
          Alert.alert('更新に失敗しました');
          return;
        }
      },
      onError: () => {
        setSpinnerVisible(false);
        Alert.alert('更新に失敗しました');
        return;
      },
    });
  };

  const onNext = async () => {
    setSpinnerVisible(true);

    const emailResult = await auth().fetchSignInMethodsForEmail(newEmail);

    if (emailResult.length === 0) {
      Alert.prompt(
        'パスワードを入力してください',
        'メールアドレス変更には再度ログインする必要があるため、パスワードが必要です。',
        [
          {
            text: 'キャンセル',
            style: 'cancel',
            onPress: () => {
              setSpinnerVisible(false);
            },
          },
          {
            text: 'OK',
            onPress: async (password) => {
              try {
                const emailCredential = auth.EmailAuthProvider.credential(
                  email,
                  password
                );

                await firebaseUser.reauthenticateWithCredential(
                  emailCredential
                );

                Alert.alert(
                  newEmail,
                  '上記のメールアドレスに認証用のメールを送ります。\nメールアドレスを変更する場合はキャンセルを押してください。',
                  [
                    {
                      text: 'キャンセル',
                      style: 'cancel',
                      onPress: () => {
                        setSpinnerVisible(false);
                      },
                    },
                    {
                      text: '送る',
                      onPress: async () => {
                        try {
                          const { data: emailAuthCodeData } =
                            await sendEmailMutation({
                              variables: {
                                input: {
                                  email: newEmail,
                                },
                              },
                            });

                          navigation.navigate('EmaiChangeVerification', {
                            kind: 'EmailChange',
                            email: newEmail,
                            emailAuthCodeId:
                              emailAuthCodeData.createEmailAuthCode,
                          });
                        } catch (e) {
                          Alert.alert('送信に失敗しました');
                        } finally {
                          setSpinnerVisible(false);
                        }
                      },
                    },
                  ]
                );
              } catch (e) {
                if (e.code === 'auth/wrong-password') {
                  Alert.alert('パスワードが間違っています');
                } else {
                  Alert.alert('更新に失敗しました');
                }
                setSpinnerVisible(false);
              }
            },
          },
        ],
        'secure-text'
      );
    } else {
      setSpinnerVisible(false);
      Alert.alert('無効なメールアドレスです');
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Box flex="1" px="4">
          <Text fontWeight="bold" mt="2">
            現在
          </Text>

          <Text mt="2" fontWeight="bold" fontSize="md">
            {email}
          </Text>

          <Box mt="8">
            <Text fontWeight="bold">新規</Text>

            <Input
              borderWidth="0"
              borderBottomWidth="1"
              selectionColor="pink"
              mt="2"
              fontSize="16"
              fontWeight="bold"
              keyboardType="email-address"
              _focus={{
                borderBottomColor: 'pink',
              }}
              onChangeText={(text) => {
                setNewEmail(text);
              }}
            />

            <Text mt="2">メールアドレスを入力してください</Text>
          </Box>

          <AnimatedButton
            h="12"
            w="100%"
            alignSelf="center"
            position="absolute"
            style={[buttonContainerStyle]}
            _text={{
              fontSize: 18,
            }}
            onPress={onNext}
            isDisabled={!newEmail.length}
          >
            次へ
          </AnimatedButton>
        </Box>
      </SafeAreaView>

      <Spinner visible={spinnerVisible} overlayColor="rgba(0,0,0,0.5)" />
    </>
  );
};

const BUTTON_BOTTOM = 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
