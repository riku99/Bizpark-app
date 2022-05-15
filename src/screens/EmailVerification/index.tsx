import LottieView from 'lottie-react-native';
import { Button, View } from 'native-base';
import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import Mail from 'src/assets/lottie/mail.json';
import {
  useVerifyEmailAuthCodeMutation,
  VerifyEmailAuthCodeError,
} from 'src/generated/graphql';
import { useSignUpWithEmail } from 'src/hooks/auth';
import { getGraphQLError } from 'src/utils';

type Props = RootNavigationScreenProp<'EmailVerification'>;

export const EmailVerificationScreen = ({ navigation, route }: Props) => {
  const { emailAuthCodeId, email, name, password } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'メールアドレス認証',
      gestureEnabled: false,
      headerBackVisible: false,
    });
  }, [navigation]);

  const { registerUser } = useSignUpWithEmail();
  const [verifyEmailAuthCodeMutation] = useVerifyEmailAuthCodeMutation();
  const [code, setCode] = useState('');

  const onSubmit = async () => {
    await verifyEmailAuthCodeMutation({
      variables: {
        id: emailAuthCodeId,
        input: {
          code,
        },
      },
      onCompleted: async () => {
        await registerUser({
          email,
          password,
          name,
        });
      },
      onError: (errors) => {
        const e = getGraphQLError(errors, 0);
        if (e) {
          if (e.code === VerifyEmailAuthCodeError.Expired) {
            Alert.alert('有効期限が切れています');
            return;
          }

          if (e.code === VerifyEmailAuthCodeError.Invalid) {
            Alert.alert('コードが間違っています');
            return;
          }

          if (e.code === VerifyEmailAuthCodeError.NotFound) {
            Alert.alert(
              '認証コードが見つかりません',
              'お手数ですが初めからやり直してください。'
            );
            return;
          }
        }
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contents}>
        <LottieView
          source={Mail}
          style={{
            height: 170,
            width: 170,
            alignSelf: 'center',
            marginTop: 10,
          }}
          autoPlay
          loop
        />

        <View style={styles.texts}>
          <Text style={styles.text1}>認証用メールが送信されました</Text>
        </View>

        <View>
          <TextInput
            style={styles.codeInput}
            placeholder="認証コード"
            keyboardType="numbers-and-punctuation"
            onChangeText={setCode}
          />
        </View>

        <View style={styles.resendBox}>
          <Text>メールが届きませんか?</Text>
          <Pressable>
            <Text style={styles.text4}>再送信する</Text>
          </Pressable>
        </View>

        <Button
          w="64"
          alignSelf="center"
          mt="12"
          _text={{
            fontSize: 18,
          }}
          onPress={onSubmit}
        >
          認証する
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contents: {
    marginHorizontal: 16,
  },
  texts: {
    marginTop: 40,
    width: '100%',
  },
  text1: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text2: {
    marginTop: 10,
    fontSize: 17,
  },
  text4: {
    textDecorationLine: 'underline',
    marginLeft: 10,
  },
  resendBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  codeInput: {
    marginTop: 20,
    height: 45,
    width: 250,
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: '#cacbcc',
    borderWidth: 1,
    fontSize: 17,
    paddingHorizontal: 8,
  },
});
