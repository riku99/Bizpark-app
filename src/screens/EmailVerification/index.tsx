import LottieView from 'lottie-react-native';
import { View } from 'native-base';
import React, { useLayoutEffect } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import Mail from 'src/assets/lottie/mail.json';

type Props = RootNavigationScreenProp<'EmailVerification'>;

export const EmailVerificationScreen = ({ navigation, route }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'メールアドレス認証',
      gestureEnabled: false,
      headerBackVisible: false,
    });
  }, [navigation]);

  const onResendPress = () => {};

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
          <Text style={styles.text2}>
            メールに含まれるリンクをタップして登録を完了してください。
          </Text>
        </View>

        <Text style={styles.text3}>メールが届きませんか?</Text>
        <Pressable onPress={onResendPress}>
          <Text style={styles.text4}>再送信する</Text>
        </Pressable>
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
    marginTop: 50,
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
  text3: {
    marginTop: 40,
  },
  text4: {
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
