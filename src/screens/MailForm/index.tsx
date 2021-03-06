import auth from '@react-native-firebase/auth';
import {
  Box,
  Input,
  KeyboardAvoidingView,
  Pressable,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import React, { ComponentProps, useLayoutEffect } from 'react';
import { Controller, UseControllerProps, useForm } from 'react-hook-form';
import { Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import { useSendEmailAuthCodeMutation } from 'src/generated/graphql';
import { sendPasswordResetEmail } from 'src/helpers/sendPasswordResetEmail';
import { useSignInWithEmail } from 'src/hooks/auth';
import { useSpinner } from 'src/hooks/spinner';

type FormProps<T> = {
  label: string;
  password?: boolean;
  inputProps: ComponentProps<typeof Input>;
  controllerProps: UseControllerProps<T>;
};

const Form = <T extends {}>({
  label,
  inputProps,
  controllerProps,
}: FormProps<T>) => {
  return (
    <>
      <Text fontWeight="bold" color="textBlack">
        {label}
      </Text>
      <Controller
        control={controllerProps.control}
        name={controllerProps.name}
        render={({ field: { onChange } }) => (
          <Input
            h={45}
            borderColor="white"
            bg="#ededed"
            selectionColor="textBlack"
            color="textBlack"
            fontSize={14}
            _focus={{
              borderWidth: 0,
            }}
            onChangeText={onChange}
            keyboardAppearance="light"
            {...inputProps}
          />
        )}
      />
    </>
  );
};

type Props = {} & RootNavigationScreenProp<'MailForm'>;
type FormData = {
  email: string;
  password: string;
  name?: string;
};

export const MailFormScreen = ({ navigation, route }: Props) => {
  const { type } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type === 'signUp' ? 'ユーザー登録' : 'ログイン',
    });
  }, [navigation]);

  const { signInWithEmail } = useSignInWithEmail();
  const { colors } = useTheme();
  const { setSpinnerVisible } = useSpinner();
  const [sendEmailMutation] = useSendEmailAuthCodeMutation();
  const { control, handleSubmit, watch } = useForm<FormData>();

  const email = watch('email');
  const password = watch('password');
  const name = watch('name');

  const emailAndPaswordDisabled = !email || !password || password.length < 8;
  const disabled =
    emailAndPaswordDisabled || (type === 'signUp' ? !name : undefined);

  const onSubmmitPress = () => {
    handleSubmit(async (data) => {
      if (type === 'signUp') {
        Alert.alert(
          data.email,
          '上記のメールアドレスに認証用のメールを送ります。\nメールアドレスを変更する場合はキャンセルを押してください。',
          [
            {
              text: 'キャンセル',
              style: 'cancel',
            },
            {
              text: '送る',
              onPress: async () => {
                try {
                  const emailResult = await auth().fetchSignInMethodsForEmail(
                    data.email
                  );

                  if (emailResult.length === 0) {
                    try {
                      setSpinnerVisible(true);
                      const { data: emailAuthCodeData } =
                        await sendEmailMutation({
                          variables: {
                            input: {
                              email: data.email,
                            },
                          },
                        });

                      navigation.navigate('EmailVerification', {
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        emailAuthCodeId: emailAuthCodeData.createEmailAuthCode,
                      });
                    } catch (e) {
                      console.log(e);
                      Alert.alert('送信に失敗しました');
                    } finally {
                      setSpinnerVisible(false);
                    }
                  } else {
                    Alert.alert('無効なメールアドレスです');
                  }
                } catch (e) {
                  console.log(e);
                  Alert.alert('無効なメールアドレスです');
                }
              },
            },
          ]
        );

        return;
      }

      if (type === 'signIn') {
        await signInWithEmail({
          email: data.email,
          password: data.password,
        });
      }
    })();
  };

  const onPasswordForgetPress = () => {
    Alert.prompt(
      '登録したメールアドレスを入力してください',
      '',
      async (email) => {
        sendPasswordResetEmail(email);
      }
    );
  };

  return (
    <KeyboardAvoidingView flex={1}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <Box px={4} flex={1} bg="white">
          <VStack space={4} mt={6}>
            <Form<FormData>
              label="メールアドレス"
              inputProps={{
                placeholder: 'メールアドレス',
              }}
              controllerProps={{
                control,
                name: 'email',
              }}
            />
            <Form
              label="パスワード"
              password
              inputProps={{
                placeholder: 'パスワード(8文字以上)',
                type: 'password',
              }}
              controllerProps={{ control, name: 'password' }}
            />
            {type === 'signUp' && (
              <Form
                label="名前"
                inputProps={{
                  placeholder: '名前(後で編集可能)',
                }}
                controllerProps={{
                  control,
                  name: 'name',
                }}
              />
            )}
            <Button
              title={type === 'signUp' ? '次へ' : 'ログイン'}
              buttonStyle={{
                backgroundColor: colors.pink,
              }}
              containerStyle={{
                marginTop: 20,
              }}
              titleStyle={{
                fontWeight: 'bold',
              }}
              disabled={disabled}
              activeOpacity={1}
              onPress={onSubmmitPress}
            />

            {type === 'signIn' && (
              <Pressable onPress={onPasswordForgetPress}>
                <Text
                  color="#199dfa"
                  textDecorationLine="underline"
                  alignSelf="center"
                  marginTop="4"
                >
                  パスワードを忘れた方はこちら
                </Text>
              </Pressable>
            )}
          </VStack>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
